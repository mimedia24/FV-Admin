import React, { useEffect, useState } from "react";
import Layout from "./layout";
import TotalUserCard from "../components/totalUserCard";
import TotalRiderCard from "../components/totalRiderCard";
import TotalRestaurantCard from "../components/totalRestaurantCard";
import TotalOrderCard from "../components/totalOrderCard";
import TodayOrderCard from "../components/TodayOrderCounter";
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

// Custom Tooltip to show extra info (Delivery & Orders) on hover
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 shadow-xl rounded-lg border border-gray-200">
        <p className="font-bold text-gray-800 mb-2 border-b pb-1">{`${label} (${data.date})`}</p>
        <p className="text-sm font-medium text-blue-600">
          Food Sales:{" "}
          <span className="text-gray-700">
            BDT {data.totalSales.toLocaleString()}
          </span>
        </p>
        <p className="text-sm font-medium text-emerald-600">
          Restaurant Payout:{" "}
          <span className="text-gray-700">
            BDT {data.restaurantSales.toLocaleString()}
          </span>
        </p>
        <p className="text-sm font-medium text-amber-600">
          Delivery Fee:{" "}
          <span className="text-gray-700">
            BDT {data.deliveryAmount.toLocaleString()}
          </span>
        </p>
        <div className="mt-2 pt-2 border-t text-xs font-bold text-purple-600 uppercase">
          Total Orders: {data.totalOrders}
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          "/admin/dashboard/information",
        );
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

  if (loading)
    return (
      <Layout>
        <div className="p-10 text-center">Loading Dashboard...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="w-full px-6 py-4 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">
            Real-time business insights (Bangladesh Timezone).
          </p>
        </div>

        {/* 1. KPI Cards */}
        <div className="">
          <UnifiedStatsHeader />
        </div>

        {/* 2. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales vs Restaurant Payout Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Sales vs Restaurant Payout
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.weekDaySales}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />

                  {/* Enhanced Tooltip */}
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f9fafb" }}
                  />

                  <Legend />
                  <Bar
                    dataKey="totalSales"
                    name="Total Food Sales"
                    radius={[4, 4, 0, 0]}
                    barSize={15}
                  >
                    {stats?.weekDaySales.map((entry, index) => (
                      <Cell
                        key={`sales-${index}`}
                        fill={entry.isUpcoming ? "#BFDBFE" : "#3B82F6"}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="restaurantSales"
                    name="Restaurant Base"
                    radius={[4, 4, 0, 0]}
                    barSize={15}
                  >
                    {stats?.weekDaySales.map((entry, index) => (
                      <Cell
                        key={`res-${index}`}
                        fill={entry.isUpcoming ? "#A7F3D0" : "#10B981"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue & Delivery Area Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Revenue Overview
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.weekDaySales}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="totalSales"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    strokeWidth={3}
                    name="Sales"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Sales Summary Cards (Old Gradient Design Restored) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-md">
            <p className="opacity-80">Today's Total Sales</p>
            <h2 className="text-3xl font-bold mt-1">
              BDT {stats?.today?.totalSales?.toLocaleString()}
            </h2>
            <p className="text-xs mt-2 opacity-70">
              Restaurant: BDT {stats?.today?.restaurantSales?.toLocaleString()}
            </p>
            <p className="text-xs mt-2 opacity-70">
              Delivery charge: BDT {stats?.today?.deliveryAmount?.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-md">
            <p className="opacity-80">Weekly Sales</p>
            <h2 className="text-3xl font-bold mt-1">
              BDT {stats?.weekly?.totalSales?.toLocaleString()}
            </h2>
            <p className="text-xs mt-2 opacity-70">
              Restaurant: BDT {stats?.weekly?.restaurantSales?.toLocaleString()}
            </p> <p className="text-xs mt-2 opacity-70">
              Delivery charge: BDT {stats?.weekly?.deliveryAmount?.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-6 rounded-xl text-white shadow-md">
            <p className="opacity-80">Monthly Sales</p>
            <h2 className="text-3xl font-bold mt-1">
              BDT {stats?.monthly?.totalSales?.toLocaleString()}
            </h2>
            <p className="text-xs mt-2 opacity-70">
              Restaurant: BDT{" "}
              {stats?.monthly?.restaurantSales?.toLocaleString()}
            </p>
             <p className="text-xs mt-2 opacity-70">
              Delivery charge: BDT{" "}
              {stats?.monthly?.deliveryAmount?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
