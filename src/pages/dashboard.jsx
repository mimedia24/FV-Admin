import React, { useEffect, useState } from "react";
import Layout from "./layout";
import TotalUserCard from "../components/totalUserCard";
import TotalRiderCard from "../components/totalRiderCard";
import TotalRestaurantCard from "../components/totalRestaurantCard";
import TotalOrderCard from "../components/totalOrderCard";
import TodayOrderCard from "../components/TodayOrderCounter";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell 
} from "recharts";
import axiosInstance from "../services/axios/axiosInstance";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/admin/dashboard/information");

        console.log(response.data)
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Layout><div className="p-10 text-center">Loading Dashboard...</div></Layout>;

  return (
    <Layout>
      <div className="w-full px-6 py-4 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Real-time business insights from your order data.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <TotalUserCard />
          <TotalRiderCard />
          <TotalRestaurantCard />
          <TotalOrderCard />
          <TodayOrderCard count={stats?.today?.count} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Area Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Weekly Revenue Trend</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.weekDaySales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="totalSales" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    strokeWidth={3} 
                    name="Total Sales"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales vs Restaurant Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Sales vs Restaurant Payout</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.weekDaySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f9fafb'}} />
                  <Legend />
                  <Bar dataKey="totalSales" name="Total Sales" radius={[4, 4, 0, 0]} barSize={20}>
                    {stats?.weekDaySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isUpcoming ? "#BFDBFE" : "#3B82F6"} />
                    ))}
                  </Bar>
                  <Bar dataKey="restaurantSales" name="Restaurant Base" radius={[4, 4, 0, 0]} barSize={20}>
                    {stats?.weekDaySales.map((entry, index) => (
                      <Cell key={`cell-res-${index}`} fill={entry.isUpcoming ? "#A7F3D0" : "#10B981"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Sales Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-md">
            <p className="opacity-80 font-medium">Today's Sales</p>
            <h2 className="text-3xl font-bold mt-1">BDT {stats?.today?.totalSales?.toLocaleString()}</h2>
            <p className="text-xs mt-2 opacity-70">Restaurant: BDT {stats?.today?.restaurantSales?.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-md">
            <p className="opacity-80 font-medium">This Week</p>
            <h2 className="text-3xl font-bold mt-1">BDT {stats?.weekly?.totalSales?.toLocaleString()}</h2>
            <p className="text-xs mt-2 opacity-70">Restaurant: BDT {stats?.weekly?.restaurantSales?.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-6 rounded-xl text-white shadow-md">
            <p className="opacity-80 font-medium">This Month</p>
            <h2 className="text-3xl font-bold mt-1">BDT {stats?.monthly?.totalSales?.toLocaleString()}</h2>
            <p className="text-xs mt-2 opacity-70">Restaurant: BDT {stats?.monthly?.restaurantSales?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}