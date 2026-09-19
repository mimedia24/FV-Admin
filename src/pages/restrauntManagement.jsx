import React, { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import { Pagination, Empty, Input, Button, Switch, message } from "antd";
import RestaurantCard from "../components/restaurantCard";
import axios from "axios";
import axiosInstance from "../services/axios/axiosInstance";
import { apiAuthToken, apiPath } from "../../secrets";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import UpdateRestaurantPosition from "../components/restaurant/UpdateRestaurantPostion";
import PopularToggle from "../components/restaurant/TogglePopularRestaurant";
import RegisterNewRestaurant from "../components/restaurant/RegisterNew";
import {
  HiOutlineSearch,
  HiOutlineOfficeBuilding,
  HiPlus,
} from "react-icons/hi";
import {
  Store,
  Wallet,
  Star,
  RefreshCcw,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  MapPinned,
} from "lucide-react";

const num = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const money = (value) =>
  `BDT ${Math.trunc(num(value)).toLocaleString("en-BD")}`;

const getRestaurantBalance = (restaurant) =>
  num(
    restaurant?.balance ??
      restaurant?.walletBalance ??
      restaurant?.wallet ??
      restaurant?.amount ??
      0
  );

const getRestaurantRating = (restaurant) =>
  num(
    restaurant?.rating ??
      restaurant?.avgRating ??
      restaurant?.averageRating ??
      5
  );

export default function RestrauntManagement() {
  const [restaurantList, setRestaurantList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [forceCloseAll, setForceCloseAll] = useState(false);
  const [bulkClosing, setBulkClosing] = useState(false);
  const [zones, setZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const pageSize = 10;

  const fetchZones = async () => {
    setZonesLoading(true);
    try {
      const { data } = await axiosInstance.get("/v3/master-admin/zone/list");
      const list =
        data?.result?.data || data?.data || data?.zones || [];
      setZones(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load zones");
      setZones([]);
    } finally {
      setZonesLoading(false);
    }
  };

  const fetchRestaurants = async (currentPage = page, zone = selectedZone) => {
    if (!zone?.id) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-restaurants?page=${currentPage}&limit=${pageSize}&zoneId=${encodeURIComponent(zone.id)}`,
        {
          headers: { "x-auth-token": apiAuthToken },
        }
      );

      if (data?.success) {
        const list = data?.restaurants || [];
        setRestaurantList(list);
        setTotalCount(data?.count || data?.totalItems || list.length || 0);

        setForceCloseAll(
          list.length > 0 &&
            list.every((item) => item?.forceClosedByAdmin === true)
        );
      } else {
        setRestaurantList([]);
        setTotalCount(0);
        setForceCloseAll(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (selectedZone) fetchRestaurants(page, selectedZone);
  }, [page, selectedZone]);

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
    setPage(1);
    setSearch("");
    setRestaurantList([]);
  };

  const handleBackToZones = () => {
    setSelectedZone(null);
    setRestaurantList([]);
    setTotalCount(0);
    setSearch("");
    setPage(1);
  };

  const filteredRestaurants = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return restaurantList;

    return restaurantList.filter((res) => {
      const name = (res?.name || "").toLowerCase();
      const owner = (res?.owner || "").toLowerCase();
      const phone = String(res?.phone || "").toLowerCase();
      const address = (res?.address || "").toLowerCase();

      return (
        name.includes(q) ||
        owner.includes(q) ||
        phone.includes(q) ||
        address.includes(q)
      );
    });
  }, [restaurantList, search]);

  const totalBalance = useMemo(() => {
    return restaurantList.reduce(
      (sum, item) => sum + getRestaurantBalance(item),
      0
    );
  }, [restaurantList]);

  const averageRating = useMemo(() => {
    if (!restaurantList.length) return "0.0";

    const total = restaurantList.reduce(
      (sum, item) => sum + getRestaurantRating(item),
      0
    );

    return (total / restaurantList.length).toFixed(1);
  }, [restaurantList]);

  const forceClosedCount = useMemo(() => {
    return restaurantList.filter((item) => item?.forceClosedByAdmin).length;
  }, [restaurantList]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      if (selectedZone) {
        await fetchRestaurants(page, selectedZone);
        message.success("Restaurant list refreshed");
      } else {
        await fetchZones();
        message.success("Zone list refreshed");
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleForceCloseAll = async (checked) => {
    try {
      setBulkClosing(true);

      const { data } = await axiosInstance.put("/restaurant/force-close-all", {
        enabled: checked,
      });

      if (data?.success) {
        setForceCloseAll(checked);

        if (checked) {
          setRestaurantList((prev) =>
            prev.map((item) => ({
              ...item,
              isOpen: false,
              forceClosedByAdmin: true,
            }))
          );

          message.success("All restaurants are now force closed.");
        } else {
          setRestaurantList((prev) =>
            prev.map((item) => ({
              ...item,
              forceClosedByAdmin: false,
            }))
          );

          message.success(
            "Force close all disabled. Restaurants can now be opened manually."
          );
        }

        await fetchRestaurants(page);
      } else {
        message.error(data?.message || "Failed to update force close status.");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Force close all failed."
      );
    } finally {
      setBulkClosing(false);
    }
  };

  const statCardClass =
    "rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg";

  const statCards = [
    {
      icon: <Store size={20} />,
      title: "Total Stores",
      value: totalCount,
      subtitle: "Restaurants in the system",
      iconWrap: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: <Wallet size={20} />,
      title: "Page Balance",
      value: money(totalBalance),
      subtitle: "Current page wallet balance",
      iconWrap: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: <Star size={20} />,
      title: "Average Rating",
      value: averageRating,
      subtitle: "Current page average",
      iconWrap: "bg-amber-100 text-amber-600",
    },
    {
      icon: <ShieldAlert size={20} />,
      title: "Force Closed",
      value: forceClosedCount,
      subtitle: "Blocked by admin",
      iconWrap: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-3 md:p-5">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">
                FOOD VERSE MAIN ADMIN RESTAURANT CONTROL
              </p>
              <h1 className="mt-2 flex items-center gap-3 text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
                <HiOutlineOfficeBuilding className="text-blue-600" />
                Restaurant Partners
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {selectedZone
                  ? `Restaurants in ${selectedZone.name || `Zone ${selectedZone.id}`}`
                  : "Choose a zone to view its restaurants"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                prefix={<HiOutlineSearch className="text-slate-400" />}
                placeholder="Search current page..."
                className="!h-11 !w-full !rounded-2xl !border-slate-200 !shadow-sm md:!w-72"
              />

              <Button
                onClick={handleRefresh}
                className="!h-11 !rounded-2xl !border-slate-200 !px-5 !font-semibold"
              >
                <div className="flex items-center gap-2">
                  <RefreshCcw
                    size={15}
                    className={refreshing || loading ? "animate-spin" : ""}
                  />
                  Refresh
                </div>
              </Button>

              <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                disabled={!selectedZone}
                icon={<HiPlus className="text-lg" />}
                className="!h-11 !rounded-2xl !border-none !bg-blue-600 !px-6 !font-bold shadow-lg shadow-blue-200"
              >
                Register Partner
              </Button>
            </div>
          </div>

          {!selectedZone ? (
            <div className="rounded-[30px] border border-blue-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Restaurant Zones</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">Choose a zone</h2>
                  <p className="mt-1 text-sm text-slate-500">Select a zone to see every restaurant assigned to it.</p>
                </div>
                <MapPinned className="text-blue-600" size={28} />
              </div>
              {zonesLoading ? (
                <div className="flex justify-center py-16"><LoadingSpinner /></div>
              ) : zones.length === 0 ? (
                <Empty description="No zones found." />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => handleZoneSelect(zone)}
                      className="group rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                          <MapPinned size={21} />
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${zone.isActive === false ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"}`}>
                          {zone.isActive === false ? "Offline" : "Active"}
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-black text-slate-950">{zone.name || `Zone ${zone.id}`}</h3>
                      <p className="mt-1 text-xs text-slate-500">Zone #{zone.id}</p>
                      <p className="mt-4 text-xs font-bold text-blue-600 group-hover:underline">View restaurants →</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
          <>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid flex-1 grid-cols-2 gap-4 xl:grid-cols-4">
              {statCards.map((item) => (
                <div key={item.title} className={statCardClass}>
                  <div
                    className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconWrap}`}
                  >
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    {item.title}
                  </p>
                  <h3 className="mt-2 text-lg font-black text-slate-950 md:text-2xl">
                    {item.value}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 md:text-sm">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <ShieldAlert size={18} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Force Close All
                </p>
                <p className="text-xs text-slate-500">
                  ON = all restaurants blocked, OFF = manual open allowed
                </p>
              </div>

              <Switch
                checked={forceCloseAll}
                loading={bulkClosing}
                onChange={handleForceCloseAll}
              />
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <MapPinned size={18} className="text-blue-600" />
              <span className="text-sm font-bold text-slate-800">{selectedZone.name || `Zone ${selectedZone.id}`}</span>
              <span className="text-xs text-slate-500">All restaurants in this zone</span>
            </div>
            <Button onClick={handleBackToZones} className="!rounded-xl">Change zone</Button>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex flex-col items-center py-20 opacity-70">
                <div className="mb-4">
                  <LoadingSpinner />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  Loading restaurants...
                </p>
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="rounded-[30px] border border-slate-200 bg-white p-16 text-center shadow-sm">
                <Empty
                  description={
                    <span className="text-slate-400 font-medium">
                      No restaurants found on this page.
                    </span>
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredRestaurants.map((res) => (
                  <div
                    key={res._id}
                    className="group relative overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5"
                  >
                    <div className="p-2">
                      <RestaurantCard
                        restaurant={res}
                        setRestaurant={setRestaurantList}
                        restaurantList={restaurantList}
                      />
                    </div>

                    <div className="space-y-4 px-5 pb-5 pt-2">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Market Status
                          </span>

                          <PopularToggle
                            restaurantId={res._id}
                            initialStatus={res.isPopular || false}
                          />
                        </div>

                        <UpdateRestaurantPosition
                          restaurantId={res._id}
                          currentPosition={res.position}
                          onUpdateSuccess={() => fetchRestaurants(page)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center justify-center gap-4 pb-10">
            <Button
              shape="round"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </Button>

            <Pagination
              current={page}
              total={totalCount}
              pageSize={pageSize}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
              className="custom-pagination"
            />

            <Button
              shape="round"
              disabled={page * pageSize >= totalCount}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
          </>
          )}
        </div>
      </div>

      <RegisterNewRestaurant
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => fetchRestaurants(page, selectedZone)}
      />

      <style>{`
        .custom-pagination .ant-pagination-item {
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          font-weight: 600;
        }
        .custom-pagination .ant-pagination-item-active {
          background: #2563EB;
          border-color: #2563EB;
        }
        .custom-pagination .ant-pagination-item-active a {
          color: white !important;
        }
        .custom-pagination .ant-pagination-prev .ant-pagination-item-link,
        .custom-pagination .ant-pagination-next .ant-pagination-item-link {
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }
      `}</style>
    </Layout>
  );
}
