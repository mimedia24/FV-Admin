import React, { useEffect, useState } from "react";
import Layout from "./layout";
import OrderCard from "../components/orderCard";
import CustomSkeleton from "../components/skeleton";
import SortOrdersList from "../components/sortOrderList";
import Pagination from "../components/pagination/Pagination";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import { Button, Input, Calendar, theme, Modal } from "antd";
import { Search, CalendarDays, RefreshCw } from "lucide-react";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchRestaurantId, setSearchRestaurantId] = useState("");
  const { token } = theme.useToken();

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const limit = 10;

  async function handleGetOrderByDate(date) {
    try {
      setLoading(true);
      const todayTimestamp = new Date(date).getTime();

      const { data } = await axios.get(
        apiPath + `/admin/today-order?type=order&date=${todayTimestamp}`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
      console.log("failed to order by date.");
    } finally {
      setLoading(false);
    }
  }

  const handleCalendarSelect = (date) => {
    setIsCalendarModalOpen(false);
    handleGetOrderByDate(date.format("YYYY-MM-DD"));
  };

  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

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
      setOrders([]);
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

      if (data?.order) {
        setOrders(data.order);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-3 md:p-6">
        <div className="space-y-6">
          <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600">
                  Food Verse Main Admin Order Control
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                  Order Management
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Search by restaurant id, filter orders, check timeline and manage rider assignment.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => getOrders(1)}
                  className="!h-11 !rounded-2xl !border-slate-200 !px-5 !font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} />
                    Refresh
                  </div>
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 xl:grid-cols-[180px_1fr_auto_auto]">
              <SortOrdersList setOrders={setOrders} />

              <div className="flex gap-2">
                <Input
                  placeholder="Search by restaurant id"
                  value={searchRestaurantId}
                  onChange={(e) => setSearchRestaurantId(e.target.value)}
                  className="!h-11 !rounded-2xl"
                  prefix={<Search size={16} className="text-slate-400" />}
                />
                <Button
                  className="!h-11 !rounded-2xl !px-5 !font-semibold"
                  onClick={() => searchOrderByRestaurantId(searchRestaurantId)}
                >
                  Search
                </Button>
              </div>

              <Button
                className="!h-11 !rounded-2xl !px-5 !font-semibold"
                onClick={() => setIsCalendarModalOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  Select Date
                </div>
              </Button>

              <Button
                className="!h-11 !rounded-2xl !px-5 !font-semibold"
                onClick={() => {
                  setSearchRestaurantId("");
                  setPage(1);
                  getOrders(1);
                }}
              >
                Clear / Reload
              </Button>
            </div>

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
          </section>

          <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[1850px] w-full text-sm text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] tracking-wide">
                  <tr>
                    <th className="px-4 py-4">SL</th>
                    <th className="px-4 py-4">Order ID</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">User</th>
                    <th className="px-4 py-4">C.Phone</th>
                    <th className="px-4 py-4">Restaurant</th>
                    <th className="px-4 py-4">RS Name</th>
                    <th className="px-4 py-4">Rider</th>
                    <th className="px-4 py-4">Order Amt</th>
                    <th className="px-4 py-4">Payment Method</th>
                    <th className="px-4 py-4">Delivery Amt</th>
                    <th className="px-4 py-4">Updated At</th>
                    <th className="px-4 py-4">Timeline</th>
                    <th className="px-4 py-4">Change Status</th>
                    <th className="px-4 py-4">Assign Rider</th>
                    <th className="px-4 py-4">Delete</th>
                    <th className="px-4 py-4">View Items</th>
                    <th className="px-4 py-4">Platform</th>
                    <th className="px-4 py-4">Order History</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="19" className="p-8 text-center">
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
                      <td colSpan="19" className="text-center py-10 text-slate-400 font-medium">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              updatePage={setPage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}