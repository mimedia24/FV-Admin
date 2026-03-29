import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { Pagination, Empty, Input, Button } from "antd";
import RestaurantCard from "../components/restaurantCard";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import UpdateRestaurantPosition from "../components/restaurant/UpdateRestaurantPostion";
import PopularToggle from "../components/restaurant/TogglePopularRestaurant";
import {
  HiOutlineSearch,
  HiOutlineOfficeBuilding,
  HiPlus,
} from "react-icons/hi";
import RegisterNewRestaurant from "../components/restaurant/RegisterNew";

export default function RestrauntManagement() {
  const [restaurantList, setRestaurantList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal state
  const pageSize = 20;

  const fetchRestaurants = async (currentPage) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-restaurants?page=${currentPage}&limit=${pageSize}`,
        { headers: { "x-auth-token": apiAuthToken } },
      );

      if (data.success) {
        setRestaurantList(data.restaurants);
        setTotalCount(data.count || data.totalItems || 0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(page);
  }, [page]);

  return (
    <Layout>
      <div className="w-full px-4 sm:px-8 py-8 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <HiOutlineOfficeBuilding className="text-blue-600" />
                Restaurant Partners
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Overview and management of{" "}
                <span className="text-blue-600 font-bold">{totalCount}</span>{" "}
                active vendors
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Input
                prefix={<HiOutlineSearch className="text-slate-400" />}
                placeholder="Search vendors..."
                className="rounded-2xl border-slate-200 shadow-sm h-11 w-full md:w-64"
              />

              {/* Trigger Modal on Click */}
              <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                icon={<HiPlus className="text-lg" />}
                className="h-11 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 border-none flex items-center gap-2 font-bold shadow-lg shadow-blue-200"
              >
                Register Partner
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
              <LoadingSpinner />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
                Fetching Vendors...
              </p>
            </div>
          ) : restaurantList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {restaurantList.map((res) => (
                  <div
                    key={res._id}
                    className="group relative bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
                  >
                    <div className="p-2">
                      <RestaurantCard
                        restaurant={res}
                        setRestaurant={setRestaurantList}
                        restaurantList={restaurantList}
                      />
                    </div>

                    <div className="px-5 pb-5 pt-2 space-y-4">
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Market Status
                        </span>
                        <PopularToggle
                          restaurantId={res._id}
                          initialStatus={res.isPopular || false}
                        />
                      </div>

                      <div className="bg-white p-3 rounded-2xl border border-slate-100">
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

              <div className="mt-16 flex justify-center pb-20">
                <Pagination
                  current={page}
                  total={totalCount}
                  pageSize={pageSize}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-32 text-center">
              <Empty
                description={
                  <span className="text-slate-400 font-medium">
                    No active restaurants found in this region.
                  </span>
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal Component */}
      <RegisterNewRestaurant 
        visible={isModalVisible} 
        onCancel={() => setIsModalVisible(false)} 
        onSuccess={() => fetchRestaurants(page)} 
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