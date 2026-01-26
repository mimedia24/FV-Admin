import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../services/axios/axiosInstance";
import OrderCard from "../components/orderCard";

function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    axiosInstance
      .get(`/admin/user-order-history?id=${id}`)
      .then((res) => {
        setOrders(res.data.result.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "accept by rider":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">User Order History</h1>

        {/* Horizontal Scroll Container */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1500px]">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">SL</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">C.Phone</th>
                <th className="px-4 py-3">Restaurant</th>
                <th className="px-4 py-3">RS Name</th>
                <th className="px-4 py-3">Rider</th>
                <th className="px-4 py-3">Order Amt</th>
                <th className="px-4 py-3">Payment method</th>
                <th className="px-4 py-3">Delivery Amt</th>
                <th className="px-4 py-3">Updated At</th>
                <th className="px-4 py-3">Timeline</th>
                <th className="px-4 py-3">Change Status</th>
                <th className="px-4 py-3">Assign Rider</th>
                <th className="px-4 py-3">Delete</th>
                <th className="px-4 py-3">View Items</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Order history</th>
              </tr>
            </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <OrderCard order={order} slNo={index + 1} key={order._id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderHistoryScreen;
