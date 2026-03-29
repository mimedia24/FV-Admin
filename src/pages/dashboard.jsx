import React, { useEffect, useState } from "react";
import Layout from "./layout";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";
import axiosInstance from "../services/axios/axiosInstance";
import UnifiedStatsHeader from "../components/dashboard/UnifiedCharts";
import { HiOutlineTrendingUp, HiOutlineCalendar, HiOutlineCurrencyBangladeshi } from "react-icons/hi";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 shadow-2xl rounded-2xl border border-slate-100 ring-1 ring-black/5">
        <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1 text-sm">{`${label} (${data.date})`}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between gap-8 items-center">
            <span className="text-[12px] text-slate-500">Food Sales</span>
            <span className="text-sm font-bold text-blue-600">৳{data.totalSales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-8 items-center">
            <span className="text-[12px] text-slate-500">Payout</span>
            <span className="text-sm font-bold text-emerald-600">৳{data.restaurantSales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-8 items-center">
            <span className="text-[12px] text-slate-500">Delivery</span>
            <span className="text-sm font-bold text-amber-600">৳{data.deliveryAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
          Orders: {data.totalOrders}
        </div>
      </div>
    );
  }
  return null;
};

const MetricCard = ({ title, amount, restaurant, delivery, icon, colorClass }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 text-xl`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-tighter">Live</span>
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h2 className="text-2xl font-black text-slate-800 mt-1 tracking-tight">
        ৳{amount?.toLocaleString()}
      </h2>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Restaurant Payout</span>
        <span className="text-slate-700 font-bold">৳{restaurant?.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Delivery Revenue</span>
        <span className="text-slate-700 font-bold">৳{delivery?.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard/information");
        if (response.data.success) setStats(response.data.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">Syncing Data...</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="w-full px-8 py-8 bg-[#FBFBFE] min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Analytics for <span className="text-slate-800">Bangladesh Market</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
             <HiOutlineCalendar className="text-blue-500 ml-2" />
             <span className="text-xs font-bold text-slate-600 mr-2">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}</span>
          </div>
        </div>

        {/* 1. KPI Sections */}
        <div className="mb-10">
          <UnifiedStatsHeader />
        </div>

        {/* 2. Primary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Payout Distribution</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-[10px] font-bold text-slate-400 uppercase">Sales</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-[10px] font-bold text-slate-400 uppercase">Restaurant</span></div>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.weekDaySales}>
                  <CartesianGrid strokeDasharray="0 0" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
                  <Bar dataKey="totalSales" radius={[6, 6, 0, 0]} barSize={12}>
                    {stats?.weekDaySales.map((entry, i) => <Cell key={i} fill={entry.isUpcoming ? "#DBEAFE" : "#2563EB"} />)}
                  </Bar>
                  <Bar dataKey="restaurantSales" radius={[6, 6, 0, 0]} barSize={12}>
                    {stats?.weekDaySales.map((entry, i) => <Cell key={i} fill={entry.isUpcoming ? "#DCFCE7" : "#10B981"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-8">Growth Trajectory</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.weekDaySales}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="totalSales" stroke="#2563EB" fill="url(#chartGradient)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Sales Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard 
            title="Revenue Today" 
            amount={stats?.today?.totalSales} 
            restaurant={stats?.today?.restaurantSales}
            delivery={stats?.today?.deliveryAmount}
            icon={<HiOutlineTrendingUp />}
            colorClass="bg-blue-600 text-blue-600"
          />
          <MetricCard 
            title="Weekly Performance" 
            amount={stats?.weekly?.totalSales} 
            restaurant={stats?.weekly?.restaurantSales}
            delivery={stats?.weekly?.deliveryAmount}
            icon={<HiOutlineCalendar />}
            colorClass="bg-emerald-600 text-emerald-600"
          />
          <MetricCard 
            title="Monthly Overview" 
            amount={stats?.monthly?.totalSales} 
            restaurant={stats?.monthly?.restaurantSales}
            delivery={stats?.monthly?.deliveryAmount}
            icon={<HiOutlineCurrencyBangladeshi />}
            colorClass="bg-violet-600 text-violet-600"
          />
        </div>
      </div>
    </Layout>
  );
}