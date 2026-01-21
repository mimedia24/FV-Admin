import React, { useEffect, useState } from "react";
import { Card, Spin, Statistic } from "antd";
import axiosInstance from "../../services/axios/axiosInstance";

export default function UnifiedStatsHeader() {
  const [data, setData] = useState({
    users: 0,
    riders: 0,
    restaurants: 0,
    orders: 0,
    today: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const todayTimestamp = new Date().getTime();

      try {
        // Parallel requests for better performance
        const [usersRes, ridersRes, restRes, ordersRes, todayRes] = await Promise.all([
          axiosInstance.get("/admin/list-of-users"),
          axiosInstance.get("/admin/list-of-riders"),
          axiosInstance.get("/admin/list-of-restaurants"),
          axiosInstance.get("/admin/list-of-orders"),
          axiosInstance.get(`/admin/today-order?type=counter&date=${todayTimestamp}`),
        ]);

        setData({
          users: usersRes.data?.count || 0,
          riders: ridersRes.data?.count || 0,
          restaurants: restRes.data?.count || 0,
          orders: ordersRes.data?.count || 0,
          today: todayRes.data?.order || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const cardItems = [
    { title: "Total Users", value: data.users, color: "#3b82f6" },
    { title: "Total Riders", value: data.riders, color: "#10b981" },
    { title: "Total Restaurants", value: data.restaurants, color: "#f59e0b" },
    { title: "Total Orders", value: data.orders, color: "#8b5cf6" },
    { title: "Today Orders", value: data.today, color: "#ef4444" },
  ];

  return (
    // 'gap-6' ensures they don't stick together. 
    // 'mb-10' adds space between these cards and the charts below.
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
      {cardItems.map((item, idx) => (
        <Card 
          key={idx} 
          bordered={false} 
          className="shadow-sm border border-gray-100 rounded-xl"
          bodyStyle={{ padding: '20px' }} // Added internal padding
        >
          {loading ? (
            <div className="flex justify-center items-center h-16">
              <Spin size="small" />
            </div>
          ) : (
            <Statistic
              title={
                <span className="text-gray-400 uppercase text-xs font-bold tracking-wider">
                  {item.title}
                </span>
              }
              value={item.value}
              valueStyle={{ 
                color: item.color, 
                fontWeight: "800", 
                fontSize: "28px",
                marginTop: "4px" 
              }}
            />
          )}
        </Card>
      ))}
    </div>
  );
}