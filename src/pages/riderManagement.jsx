import React, { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import SortOrdersList from "../components/sortOrderList";
import RiderCard from "../components/riderCard";
import SearchInput from "../components/searchInput";
import { Switch, Button, Empty } from "antd";
import RiderHeader from "../components/rider/RiderHeader";
import RiderPagination from "../components/rider/RiderPagination";
import {
  Bike,
  Search,
  RefreshCcw,
  Filter,
  Users,
  ShieldCheck,
  FileSearch,
  Sparkles,
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

export default function OrderManagement() {
  const [riders, setRiders] = useState(null);
  const [searchType, setSearchType] = useState("phone");
  const [searchResult, setSearchResult] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, refetch } = useFetch(
    `/admin/list-of-riders?page=${page}`
  );

  useEffect(() => {
    console.log(data);
    setRiders(data);
    setTotalPage(data?.totalPages);
  }, [data]);

  const totalRiders = riders?.riders?.length || 0;

  const totalRiderEarning = useMemo(() => {
    return (riders?.riders || []).reduce((sum, rider) => {
      const amount = Number(
        rider?.earning ??
          rider?.totalEarning ??
          rider?.wallet ??
          rider?.balance ??
          rider?.total_income ??
          0
      );
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  }, [riders]);

  const totalCashCollection = useMemo(() => {
    return (riders?.riders || []).reduce((sum, rider) => {
      const amount = Number(
        rider?.cashCollection ??
          rider?.cash ??
          rider?.cashCollected ??
          rider?.collectionAmount ??
          rider?.cash_collection ??
          0
      );
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  }, [riders]);

  const pageLabel = useMemo(() => `Page ${page}`, [page]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch?.();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-3 md:p-5">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}
          <div className="relative mb-8 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/50">
                  <Bike className="h-8 w-8" />
                </div>

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    Rider Control Center
                  </div>

                  <h1 className="m-0 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                    Riders Management
                  </h1>

                  <p className="mt-2 text-sm text-slate-500 md:text-base">
                    Search, filter and manage all registered delivery riders
                    from one clean admin workspace.
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
                      className={refreshing || loading ? "animate-spin" : ""}
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
              icon={Users}
              label="Loaded Riders"
              value={totalRiders}
              helper="Riders currently visible on this page"
              color="blue"
            />
            <StatCard
              icon={FileSearch}
              label="Total Cash Collection"
              value={`BDT ${Math.trunc(totalCashCollection)}`}
              helper="All loaded riders cash collection"
              color="emerald"
            />
            <StatCard
              icon={ShieldCheck}
              label="Total Rider Earning"
              value={`BDT ${Math.trunc(totalRiderEarning)}`}
              helper="All loaded riders earning"
              color="amber"
            />
            <StatCard
              icon={Bike}
              label="Current Page"
              value={page}
              helper={pageLabel}
              color="violet"
            />
          </div>

          {/* Filter + Search */}
          <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <h3 className="m-0 text-xl font-extrabold text-slate-900">
                Filter & Search Riders
              </h3>
              <p className="m-0 mt-1 text-sm text-slate-500">
                Narrow down rider list using sort options and search tools.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Filter className="h-4 w-4 text-blue-600" />
                  Filter Riders
                </div>

                <div className="flex items-center">
                  <SortOrdersList setRiders={setRiders} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Search className="h-4 w-4 text-violet-600" />
                  Search Riders
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Search by
                    </span>

                    <Switch
                      checkedChildren={searchType}
                      unCheckedChildren={searchType}
                      defaultChecked
                      onChange={() => {
                        setSearchType((prev) => {
                          return prev === "phone" ? "id" : "phone";
                        });
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <SearchInput
                      inputType="rider"
                      searchType={searchType}
                      setSearchResult={setSearchResult}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Result */}
          {searchResult && (
            <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="m-0 text-xl font-extrabold text-slate-900">
                    Search Result
                  </h3>
                  <p className="m-0 mt-1 text-sm text-slate-500">
                    Matching rider information based on current search.
                  </p>
                </div>
              </div>

              <div>
                {searchResult &&
                  (Array.isArray(searchResult?.riders) ? (
                    <div className="flex items-center justify-center gap-12 flex-wrap">
                      {searchResult.riders.map((rider) => (
                        <RiderCard
                          key={rider._id}
                          order={rider}
                          refreshData={refetch}
                        />
                      ))}
                    </div>
                  ) : searchResult?.riders ? (
                    <div className="flex items-center justify-center gap-12 flex-wrap">
                      <RiderCard
                        order={searchResult.riders}
                        refreshData={refetch}
                      />
                    </div>
                  ) : null)}
              </div>
            </div>
          )}

          {/* Rider List */}
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4 md:px-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="m-0 text-xl font-extrabold text-slate-900">
                    Rider Directory
                  </h3>
                  <p className="m-0 mt-1 text-sm text-slate-500">
                    Browse all riders and manage rider status from the card list.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                    Riders: {totalRiders}
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
                    Page: {page}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="mb-6">
                <RiderHeader />
              </div>

              {riders === null && loading ? (
                <div className="flex items-center justify-center py-16">
                  <CustomSkeleton />
                </div>
              ) : riders && riders?.riders?.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-6">
                  {riders?.riders.map((rider) => (
                    <RiderCard
                      order={rider}
                      key={rider._id}
                      refreshData={refetch}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16">
                  <Empty description="No riders found" />
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <RiderPagination setPage={setPage} totalPage={totalPage} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}