import React, { useEffect, useState } from "react";
import Layout from "./layout";
import OrderCard from "../components/orderCard";
import CustomSkeleton from "../components/skeleton";
import SortOrdersList from "../components/sortOrderList";
import Pagination from "../components/pagination/Pagination";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import { Button, Input, Calendar, theme, Modal } from "antd";
import useFetch from "../useFetch/useFetch";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchRestaurantId, setSearchRestaurantId] = useState("");
  const { token } = theme.useToken();

  // Calendar modal state
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  async function handleGetOrderByDate(date) {
    try {
      const todayTimestamp = new Date(date).getTime();

      console.log("", todayTimestamp);

      const { data } = await axios.get(
        apiPath + `/admin/today-order?type=order&date=${todayTimestamp}`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );



      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      setOrders([])
      console.log("failed to order by date.");
    }
  }

  const handleCalendarSelect = (date) => {
    console.log("Selected date:", date.format("YYYY-MM-DD"));
    onPanelChange(date, "date");
    setIsCalendarModalOpen(false);
    handleGetOrderByDate(date.format("YYYY-MM-DD"));
  };

  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const limit = 10;

  const getOrders = async (pageNumber = page) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-orders?page=${pageNumber}&limit=${limit}`,
        { headers: { "x-auth-token": apiAuthToken } }
      );

      if (data?.orders) {
        setOrders(data.orders);
        const totalOrders = data.totalOrders || data.orders.length;
        setTotalPages(Math.ceil(totalOrders / limit));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders(page);
  }, [page]);

  async function searchOrderByRestaurantId(id) {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${apiPath}/admin/restaurant/search-order/${id}?page=${page}&limit=${25}`,
        { headers: { "x-auth-token": apiAuthToken } }
      );

      console.log("data : ", data);
      if (data?.order) {
        setOrders(data.order);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="w-full py-4 px-6">
        <h1 className="text-3xl text-center font-extrabold text-gray-700 mb-6">
          Order Management
        </h1>

        {/* Filter */}
        <div className="w-full flex flex-wrap items-center gap-4 mb-6">
          <span className="font-semibold text-gray-600">Filter:</span>
          <SortOrdersList setOrders={setOrders} />
          <div className="flex gap-2">
            <Input
              placeholder="Search by restaurant id"
              value={searchRestaurantId}
              onChange={(e) => setSearchRestaurantId(e.target.value)}
            />
            <Button
              onClick={() => searchOrderByRestaurantId(searchRestaurantId)}
            >
              Search
            </Button>
          </div>

          {/* Calendar Modal Button */}
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCalendarModalOpen(true)}>
              Select Date
            </Button>

            <Modal
              title="Select Date"
              open={isCalendarModalOpen}
              onCancel={() => setIsCalendarModalOpen(false)}
              footer={null}
            >
              <div style={wrapperStyle}>
                <Calendar fullscreen={false} onSelect={handleCalendarSelect} />
              </div>
            </Modal>
          </div>
        </div>

        {/* Modern Table */}
        <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
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
                <th className="px-4 py-3">Delivery Amt</th>
                <th className="px-4 py-3">Updated At</th>
                <th className="px-4 py-3">Change Status</th>
                <th className="px-4 py-3">Assign Rider</th>
                <th className="px-4 py-3">Delete</th>
                <th className="px-4 py-3">View Items</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="15" className="p-6">
                    <CustomSkeleton />
                  </td>
                </tr>
              ) : orders?.length > 0 ? (
                orders.map((order, index) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    slNo={index}
                    getOrders={getOrders}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="15" className="text-center py-6 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="w-full flex justify-center mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            updatePage={setPage}
          />
        </div>
      </div>
    </Layout>
  );
}
