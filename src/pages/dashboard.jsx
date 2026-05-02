import React, { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import axiosInstance from "../services/axios/axiosInstance";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Sparkles,
  Wallet,
  PackageSearch,
  Bike,
  ShoppingBag,
  Store,
  Users,
  UtensilsCrossed,
  HandCoins,
  Coins,
} from "lucide-react";

const iconMap = {
  users: Users,
  rider: Bike,
  restaurant: Store,
  orders: ShoppingBag,
  today: PackageSearch,
};

const toneMap = {
  blue: {
    border: "border-blue-200",
    glow: "shadow-[0_10px_40px_rgba(37,99,235,0.16)]",
    icon: "bg-blue-500/10 text-blue-700 ring-1 ring-blue-200",
    summary: "from-blue-700 via-blue-600 to-cyan-500",
  },
  emerald: {
    border: "border-emerald-200",
    glow: "shadow-[0_10px_40px_rgba(5,150,105,0.16)]",
    icon: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-200",
    summary: "from-emerald-700 via-emerald-600 to-lime-500",
  },
  violet: {
    border: "border-violet-200",
    glow: "shadow-[0_10px_40px_rgba(124,58,237,0.18)]",
    icon: "bg-violet-500/10 text-violet-700 ring-1 ring-violet-200",
    summary: "from-violet-700 via-fuchsia-600 to-pink-500",
  },
  amber: {
    border: "border-amber-200",
    glow: "shadow-[0_10px_40px_rgba(245,158,11,0.16)]",
    icon: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-200",
    summary: "from-amber-600 via-orange-500 to-rose-500",
  },
  rose: {
    border: "border-rose-200",
    glow: "shadow-[0_10px_40px_rgba(244,63,94,0.16)]",
    icon: "bg-rose-500/10 text-rose-700 ring-1 ring-rose-200",
    summary: "from-rose-600 via-pink-500 to-fuchsia-500",
  },
};

const toNumber = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (value) =>
  `BDT ${Math.trunc(toNumber(value)).toLocaleString("en-BD")}`;

function extractCount(payload) {
  if (typeof payload === "number") return payload;
  if (!payload) return 0;

  if (typeof payload?.totalCount === "number") return payload.totalCount;
  if (typeof payload?.count === "number") return payload.count;
  if (typeof payload?.total === "number") return payload.total;
  if (typeof payload?.order === "number") return payload.order;
  if (typeof payload?.orderCount === "number") return payload.orderCount;

  if (typeof payload?.data?.totalCount === "number")
    return payload.data.totalCount;
  if (typeof payload?.data?.count === "number") return payload.data.count;
  if (typeof payload?.data?.total === "number") return payload.data.total;
  if (typeof payload?.data?.order === "number") return payload.data.order;
  if (typeof payload?.data?.orderCount === "number")
    return payload.data.orderCount;

  if (Array.isArray(payload?.data)) return payload.data.length;
  if (Array.isArray(payload?.result)) return payload.result.length;
  if (Array.isArray(payload?.orders)) return payload.orders.length;
  if (Array.isArray(payload)) return payload.length;

  return 0;
}

function HeroChip({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

function StatCard({ item, isUpdating = false }) {
  const Icon = iconMap[item.icon] || ShoppingBag;
  const tone = toneMap[item.tone] || toneMap.blue;

  return (
    <div
      className={`rounded-[28px] border bg-white p-5 ${tone.border} ${tone.glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
            {item.title}
          </p>

          <div className="mt-3 min-h-[48px]">
            {isUpdating ? (
              <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
            ) : (
              <h3 className="text-4xl font-black tracking-tight text-slate-950">
                {toNumber(item.value).toLocaleString("en-BD")}
              </h3>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500">{item.sub}</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-[22px] ${tone.icon}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, badge }) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-950">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {badge ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function SalesSummaryCard({ item, tone = "blue" }) {
  const toneStyle = toneMap[tone] || toneMap.blue;

  const rows = [
    { label: "Food Sell", value: item.foodSell, icon: UtensilsCrossed },
    { label: "Restaurant Sell", value: item.restaurantSell, icon: Store },
    { label: "Delivery Fee", value: item.deliveryFee, icon: Wallet },
    { label: "Delivery Profit", value: item.deliveryProfit, icon: HandCoins },
    { label: "Rider Tips", value: item.riderTips, icon: Coins },
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-[34px] bg-gradient-to-br ${toneStyle.summary} p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-6`}
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white/90">{item.title}</p>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90">
            Live
          </span>
        </div>

        <div className="mt-3">
          <h3 className="text-4xl font-black tracking-tight md:text-5xl">
            {formatMoney(item.foodSell)}
          </h3>
        </div>

        <div className="mt-6 grid gap-3">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-3 py-3 backdrop-blur"
              >
                <span className="inline-flex items-center gap-2 text-sm text-white/90">
                  <Icon className="h-4 w-4" />
                  {row.label}
                </span>
                <span className="text-sm font-bold text-white">
                  {formatMoney(row.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!(active && payload && payload.length)) return null;
  const data = payload[0]?.payload || {};

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
      <p className="mb-2 border-b border-slate-100 pb-1 text-sm font-bold text-slate-800">
        {label}
      </p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-8">
          <span className="text-[12px] text-slate-500">Food Sales</span>
          <span className="text-sm font-bold text-blue-600">
            {formatMoney(data.foodSell)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-8">
          <span className="text-[12px] text-slate-500">Restaurant Sell</span>
          <span className="text-sm font-bold text-emerald-600">
            {formatMoney(data.restaurantSell)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-8">
          <span className="text-[12px] text-slate-500">Delivery Fee</span>
          <span className="text-sm font-bold text-amber-600">
            {formatMoney(data.deliveryFee)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-8">
          <span className="text-[12px] text-slate-500">Delivery Profit</span>
          <span className="text-sm font-bold text-violet-600">
            {formatMoney(data.deliveryProfit)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-8">
          <span className="text-[12px] text-slate-500">Rider Tips</span>
          <span className="text-sm font-bold text-rose-600">
            {formatMoney(data.riderTips)}
          </span>
        </div>
      </div>

      <div className="mt-3 border-t border-slate-100 pt-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        Total Order: {toNumber(data.totalOrder).toLocaleString("en-BD")}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [countsLoading, setCountsLoading] = useState(true);
  const [counts, setCounts] = useState({
    users: 0,
    riders: 0,
    restaurants: 0,
    orders: 0,
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;

    async function fetchDashboardFirst() {
      try {
        const dashboardRes = await axiosInstance.get(
          "/admin/dashboard/information"
        );

        if (!active) return;

        const payload =
          dashboardRes?.data?.data ??
          dashboardRes?.data?.result ??
          dashboardRes?.data ??
          null;

        setStats(payload);
      } catch (error) {
        if (active) {
          console.error("Dashboard main stats fetch error:", error);
          setStats(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }

      try {
        const [usersRes, ridersRes, restaurantsRes, ordersRes] =
          await Promise.allSettled([
            axiosInstance.get("/admin/list-of-users"),
            axiosInstance.get("/admin/list-of-riders"),
            axiosInstance.get("/admin/list-of-restaurants"),
            axiosInstance.get("/admin/list-of-orders"),
          ]);

        if (!active) return;

        setCounts({
          users:
            usersRes.status === "fulfilled"
              ? extractCount(usersRes.value?.data)
              : 0,
          riders:
            ridersRes.status === "fulfilled"
              ? extractCount(ridersRes.value?.data)
              : 0,
          restaurants:
            restaurantsRes.status === "fulfilled"
              ? extractCount(restaurantsRes.value?.data)
              : 0,
          orders:
            ordersRes.status === "fulfilled"
              ? extractCount(ordersRes.value?.data)
              : 0,
        });
      } catch (error) {
        if (active) {
          console.error("Dashboard count fetch error:", error);
        }
      } finally {
        if (active) {
          setCountsLoading(false);
        }
      }
    }

    fetchDashboardFirst();

    return () => {
      active = false;
    };
  }, []);

  const weekDaySales = useMemo(() => {
    const rows = Array.isArray(stats?.weekDaySales) ? stats.weekDaySales : [];

    return rows.map((item) => {
      const deliveryProfit = toNumber(item?.deliveryProfit);

      return {
        label: item?.day || item?.label || "—",
        foodSell: toNumber(item?.totalSales ?? item?.foodSell),
        restaurantSell: toNumber(item?.restaurantSales ?? item?.restaurantSell),
        deliveryFee: toNumber(item?.deliveryAmount ?? item?.deliveryFee),
        deliveryProfit,
        chartDeliveryProfit: deliveryProfit < 0 ? 0 : deliveryProfit,
        riderTips: toNumber(item?.riderTips),
        totalOrder: toNumber(item?.totalOrders ?? item?.totalOrder),
        isUpcoming: !!item?.isUpcoming,
      };
    });
  }, [stats]);

  const revenueOverview = useMemo(() => {
    return weekDaySales.map((item) => ({
      label: item.label,
      foodSell: item.foodSell,
    }));
  }, [weekDaySales]);

  const salesSummary = useMemo(() => {
    const makeCard = (title, source, tone) => ({
      title,
      foodSell: toNumber(source?.totalSales ?? source?.foodSell),
      restaurantSell: toNumber(
        source?.restaurantSales ?? source?.restaurantSell
      ),
      deliveryFee: toNumber(source?.deliveryAmount ?? source?.deliveryFee),
      deliveryProfit: toNumber(source?.deliveryProfit),
      riderTips: toNumber(source?.riderTips),
      tone,
    });

    return [
      makeCard("Today's Sell", stats?.today, "blue"),
      makeCard("Weekly Sales", stats?.weekly, "emerald"),
      makeCard("Monthly Sales", stats?.monthly, "violet"),
    ];
  }, [stats]);

  const statCards = [
    {
      title: "Today Order",
      value: toNumber(stats?.today?.count),
      sub: "Orders placed today",
      icon: "today",
      tone: "blue",
    },
    {
      title: "Total Order",
      value: counts.orders,
      sub: "All-time orders",
      icon: "orders",
      tone: "violet",
    },
    {
      title: "Total Rider",
      value: counts.riders,
      sub: "Registered riders",
      icon: "rider",
      tone: "emerald",
    },
    {
      title: "Total Restaurant",
      value: counts.restaurants,
      sub: "Active partner restaurants",
      icon: "restaurant",
      tone: "amber",
    },
    {
      title: "Total Users",
      value: counts.users,
      sub: "Registered users",
      icon: "users",
      tone: "rose",
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-[28px] bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-3 md:p-6">
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_top_left,_#1e3a8a,_#020617_45%,_#2563eb_100%)] p-6 text-white shadow-[0_20px_65px_rgba(15,23,42,0.18)] md:p-8">
            <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />
            <div className="absolute bottom-0 right-20 h-36 w-36 rounded-full bg-blue-300/10 blur-3xl" />

            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-200">
                FOOD VERSE MAIN ADMIN PANEL
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                Food Verse Main Control Panel
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
                Real-time business insights (Bangladesh Timezone)
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <HeroChip icon={Sparkles} label="Aggressive Live UI" />
                <HeroChip icon={Wallet} label="Mobile Responsive" />
                <HeroChip icon={PackageSearch} label="Admin Focused Data" />
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statCards.map((item) => (
              <StatCard
                key={item.title}
                item={item}
                isUpdating={countsLoading && item.title !== "Today Order"}
              />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <SectionCard
              title="Order Overview"
              subtitle="Food sales, restaurant sell, delivery fee, delivery profit, rider tips and total order"
              badge="Live Comparison"
            >
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekDaySales}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      domain={[0, "auto"]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="deliveryFee"
                      fill="#f59e0b"
                      radius={[10, 10, 0, 0]}
                      name="Delivery Fee"
                    />
                    <Bar
                      dataKey="chartDeliveryProfit"
                      fill="#8b5cf6"
                      radius={[10, 10, 0, 0]}
                      name="Delivery Profit"
                    />
                    <Bar
                      dataKey="foodSell"
                      fill="#2563eb"
                      radius={[10, 10, 0, 0]}
                      name="Food Sell"
                    />
                    <Bar
                      dataKey="restaurantSell"
                      fill="#22c55e"
                      radius={[10, 10, 0, 0]}
                      name="Restaurant Sell"
                    />
                    <Bar
                      dataKey="riderTips"
                      fill="#ef4444"
                      radius={[10, 10, 0, 0]}
                      name="Rider Tips"
                    />
                    <Bar
                      dataKey="totalOrder"
                      fill="#0f172a"
                      radius={[10, 10, 0, 0]}
                      name="Total Order"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard
              title="Revenue Overview"
              subtitle="Only food sales"
              badge="Food Sales Only"
            >
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueOverview}>
                    <defs>
                      <linearGradient
                        id="sellGradientMain"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(value) => formatMoney(value)}
                      contentStyle={{
                        borderRadius: 18,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 12px 35px rgba(2,6,23,0.12)",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="foodSell"
                      stroke="#2563eb"
                      strokeWidth={4}
                      fill="url(#sellGradientMain)"
                      name="Food Sales"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            {salesSummary.map((item) => (
              <SalesSummaryCard
                key={item.title}
                item={item}
                tone={item.tone}
              />
            ))}
          </section>
        </div>
      </div>
    </Layout>
  );
}