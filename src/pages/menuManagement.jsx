import React, { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import CustomSkeleton from "../components/skeleton";
import FilterMenu from "../components/menu/filterMenu";
import MenuCard from "../components/menu/menuCard";
import FilterMenuByCategory from "../components/menu/FilterMenuByCategory";
import { apiAuthToken, apiPath } from "../../secrets";
import axios from "axios";
import SearchMenuById from "../components/menu/SearchMenuById";
import axiosInstance from "../services/axios/axiosInstance";
import SearchMenuByRestaurantId from "../components/menu/SearchMenuByRestaurantId";
import { Button, Empty } from "antd";
import {
  UtensilsCrossed,
  Search,
  RefreshCcw,
  Filter,
  PackageSearch,
  Layers3,
  Store,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const statThemes = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-600",
    border: "border-blue-200",
    glow: "shadow-[0_10px_40px_rgba(37,99,235,0.10)]",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-600",
    border: "border-emerald-200",
    glow: "shadow-[0_10px_40px_rgba(16,185,129,0.10)]",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-600",
    border: "border-amber-200",
    glow: "shadow-[0_10px_40px_rgba(245,158,11,0.10)]",
  },
  violet: {
    iconBg: "bg-violet-500/10",
    iconText: "text-violet-600",
    border: "border-violet-200",
    glow: "shadow-[0_10px_40px_rgba(139,92,246,0.10)]",
  },
};

function StatCard({ icon: Icon, label, value, helper, color = "blue" }) {
  const theme = statThemes[color] || statThemes.blue;

  return (
    <div
      className={`rounded-[24px] border bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${theme.border} ${theme.glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>
          <div className="text-3xl font-black leading-none text-slate-900">
            {value}
          </div>
          <div className="mt-3 text-sm text-slate-500">{helper}</div>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${theme.iconBg} ${theme.iconText}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function MenuManagement() {
  const [menus, setMenus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  async function getMenus(page = 1) {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-menus?page=${page}&limit=20`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (data) {
        setMenus(data.menus);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching menus:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchMenu(menuId) {
    try {
      const { data } = await axiosInstance.get(`/admin/search-menu/by-id`, {
        params: {
          id: menuId,
        },
      });

      if (data.success) {
        setMenus([data.result]);
        setTotalPages(1);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleSearchByRestaurantId(restaurantId) {
    try {
      const { data } = await axiosInstance.get(
        `/admin/search-menu/by-restaurant-id`,
        {
          params: {
            id: restaurantId,
          },
        }
      );

      if (data.success) {
        setMenus(data.result);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    getMenus(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleRefresh = async () => {
    await getMenus(currentPage);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`min-w-[42px] rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            currentPage === i
              ? "border-slate-900 bg-slate-900 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const totalMenus = menus?.length || 0;
  const pageLabel = useMemo(() => `Page ${currentPage}`, [currentPage]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-3 md:p-6">
        <div className="mx-auto max-w-[1700px]">
          {/* Header */}
          <div className="relative mb-8 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/50">
                  <UtensilsCrossed className="h-8 w-8" />
                </div>

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    Menu Control Center
                  </div>

                  <h1 className="m-0 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                    Menu Management
                  </h1>

                  <p className="mt-2 text-sm text-slate-500 md:text-base">
                    Search, filter and manage all menus from one clean admin workspace.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleRefresh}
                  className="!h-11 !rounded-xl !border-slate-200 !px-5 !font-semibold !text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <RefreshCcw
                      size={15}
                      className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={PackageSearch}
              label="Loaded Menus"
              value={totalMenus}
              helper="Menus currently visible in this view"
              color="blue"
            />
            <StatCard
              icon={Layers3}
              label="Current Page"
              value={currentPage}
              helper={pageLabel}
              color="emerald"
            />
            <StatCard
              icon={Store}
              label="Total Pages"
              value={totalPages}
              helper="Available menu pages"
              color="amber"
            />
            <StatCard
              icon={Search}
              label="Items Per Page"
              value={itemsPerPage}
              helper="Current serial base in UI"
              color="violet"
            />
          </div>

          {/* Filters + Search */}
          <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h3 className="m-0 text-xl font-extrabold text-slate-900">
                Filter & Search Menus
              </h3>
              <p className="m-0 mt-1 text-sm text-slate-500">
                Narrow down menu list by type, category, menu id or restaurant id.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Filter className="h-4 w-4 text-blue-600" />
                  Filter Menu
                </div>
                <FilterMenu setMenus={setMenus} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Layers3 className="h-4 w-4 text-emerald-600" />
                  Filter by Category
                </div>
                <FilterMenuByCategory />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Search className="h-4 w-4 text-violet-600" />
                  Search by Menu ID
                </div>
                <SearchMenuById onSearch={handleSearchMenu} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Store className="h-4 w-4 text-amber-600" />
                  Search by Restaurant ID
                </div>
                <SearchMenuByRestaurantId onSearch={handleSearchByRestaurantId} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4 md:px-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="m-0 text-xl font-extrabold text-slate-900">
                    Menu Directory
                  </h3>
                  <p className="m-0 mt-1 text-sm text-slate-500">
                    Review every menu item, pricing, category, approval and status.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                    Menus: {totalMenus}
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
                    Page: {currentPage}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto p-4 md:p-6">
              <table className="w-full min-w-[2100px] text-[12px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      SL No
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      ID
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Thumbnails
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Restaurant ID
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Category
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Status
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Title
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Description
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Based Price
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Platform Fee
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Based + Fee
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Discount
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Offer Price
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Change Status
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Update Discount
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Update Platform Fee
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Admin Approval
                    </th>
                    <th className="border border-slate-200 px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                      Popular
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="18" className="py-10 text-center">
                        <div className="flex justify-center">
                          <CustomSkeleton />
                        </div>
                      </td>
                    </tr>
                  ) : menus && menus.length > 0 ? (
                    menus.map((menu, index) => (
                      <MenuCard
                        key={menu?._id}
                        menus={menus}
                        setMenus={setMenus}
                        menu={menu}
                        slNo={(currentPage - 1) * itemsPerPage + index + 1}
                        getMenus={getMenus}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="18" className="py-14 text-center">
                        <Empty description="No menus found" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 mb-4 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {renderPaginationButtons()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}