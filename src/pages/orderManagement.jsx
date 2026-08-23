import { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import OrderCard from "../components/orderCard";
import CustomSkeleton from "../components/skeleton";
import { apiAuthToken, apiPath } from "../../secrets";
import {
  Button,
  Empty,
  Input,
  Pagination,
  Select,
  Tag,
  message,
} from "antd";
import {
  CalendarDays,
  ClipboardList,
  RefreshCw,
  Search,
  ShoppingBag,
  CheckCircle2,
  Wallet,
} from "lucide-react";

const ORDER_LIMIT = 15;

const tableHeading = [
  "SL",
  "Order ID",
  "Status",
  "User ID",
  "Customer Phone",
  "Restaurant ID",
  "Restaurant",
  "Rider ID",
  "Amount",
  "Payment",
  "Update Time",
  "Timeline",
  "Change Status",
  "Assign Rider",
  "Trash",
  "Items",
  "Platform",
  "History",
];

const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "accept by restaurant", label: "Accept by Restaurant" },
  { value: "accept by rider", label: "Accept by Rider" },
  { value: "ready for pickup", label: "Ready for Pickup" },
  { value: "picked up", label: "Picked Up" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled by restaurant", label: "Cancelled by Restaurant" },
  { value: "cencelled", label: "Cancelled" },
];

const toNumber = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const money = (value) =>
  `BDT ${Math.round(toNumber(value)).toLocaleString("en-BD")}`;

const getLocalDate = (value = new Date()) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const getToday = () => getLocalDate(new Date());

const extractOrders = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.result?.orders)) return payload.result.orders;
  if (Array.isArray(payload?.data?.orders)) return payload.data.orders;
  return [];
};

const extractTotal = (payload, fallback = 0) => {
  return (
    toNumber(payload?.count) ||
    toNumber(payload?.total) ||
    toNumber(payload?.totalCount) ||
    toNumber(payload?.totalOrders) ||
    toNumber(payload?.result?.count) ||
    toNumber(payload?.result?.total) ||
    toNumber(payload?.data?.count) ||
    toNumber(payload?.data?.total) ||
    fallback
  );
};

const getOrderDate = (order) => {
  return (
    order?.orderDate ||
    order?.createdAt ||
    order?.updateTime ||
    order?.updatedAt ||
    order?.date ||
    ""
  );
};

const getOrderAmount = (order) => {
  return (
    toNumber(order?.totalAfterVoucherApplied) ||
    toNumber(order?.finalAmount) ||
    toNumber(order?.payableAmount) ||
    toNumber(order?.grandTotal) ||
    toNumber(order?.totalAmount) ||
    toNumber(order?.orderAmount)
  );
};

const getDeliveryFee = (order) => {
  return toNumber(
    order?.deliveryAmount ??
      order?.deliveryFee ??
      order?.deliveryCharge ??
      order?.deliveryCost
  );
};

const getRiderTips = (order) => {
  return toNumber(
    order?.riderTips ??
      order?.riderTip ??
      order?.tip ??
      order?.tips ??
      order?.deliveryTip
  );
};

const getOrderPlatformFee = (order) => {
  return toNumber(
    order?.orderPlatformFee ??
      order?.orderPlatformFeeSnapshot?.effectiveAmount ??
      0
  );
};

const isDelivered = (order) => {
  const status = String(order?.status || order?.orderStatus || "").toLowerCase();
  return (
    status.includes("delivered") ||
    status.includes("complete") ||
    status.includes("success")
  );
};

function StatCard({ title, value, helper, icon, tone = "blue" }) {
  const themes = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    purple: "border-violet-200 bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">{value}</h3>
          <p className="mt-2 text-xs text-slate-500">{helper}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
            themes[tone] || themes.blue
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [rawPayload, setRawPayload] = useState(null);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchType, setSearchType] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getOrders = async (nextPage = page) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${apiPath}/admin/list-of-orders?page=${nextPage}&limit=${ORDER_LIMIT}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "x-auth-token": apiAuthToken,
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      const list = extractOrders(result);
      setOrders(list);
      setRawPayload(result);
      setTotalOrders(extractTotal(result, list.length));
    } catch (error) {
      console.log("Order fetch error:", error);
      message.error("Failed to load orders.");
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredOrders = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return orders.filter((order) => {
      const status = String(order?.status || "").toLowerCase();

      const statusMatched =
        statusFilter === "all" || status === String(statusFilter).toLowerCase();

      const orderDate = getOrderDate(order);
      const date = getLocalDate(orderDate);

      const startMatched = !startDate || (date && date >= startDate);
      const endMatched = !endDate || (date && date <= endDate);

      const searchable = {
        all: [
          order?._id,
          order?.userId,
          order?.customerPhone,
          order?.restaurantId,
          order?.restaurantName,
          order?.riderId,
          order?.paymentMethod,
          order?.peymentMethod,
          order?.platform,
        ],
        order: [order?._id],
        user: [order?.userId],
        phone: [order?.customerPhone],
        restaurant: [order?.restaurantId, order?.restaurantName],
        rider: [order?.riderId],
      };

      const searchMatched =
        !q ||
        (searchable[searchType] || searchable.all).some((item) =>
          String(item || "").toLowerCase().includes(q)
        );

      return statusMatched && startMatched && endMatched && searchMatched;
    });
  }, [orders, searchText, searchType, statusFilter, startDate, endDate]);

  const stats = useMemo(() => {
    return {
      loaded: orders.length,
      filtered: filteredOrders.length,
      delivered: filteredOrders.filter(isDelivered).length,
      amount: filteredOrders.reduce((sum, item) => sum + getOrderAmount(item), 0),
      delivery: filteredOrders.reduce((sum, item) => sum + getDeliveryFee(item), 0),
      tips: filteredOrders.reduce((sum, item) => sum + getRiderTips(item), 0),
      platformFee: filteredOrders.reduce(
        (sum, item) => sum + getOrderPlatformFee(item),
        0
      ),
    };
  }, [orders, filteredOrders]);

  const clearFilters = () => {
    setStatusFilter("all");
    setSearchType("all");
    setSearchText("");
    setStartDate("");
    setEndDate("");
  };

  const goToday = () => {
    const today = getToday();
    setStartDate(today);
    setEndDate(today);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-blue-600">
                Food Verse Main Admin Order Control
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                Order Management
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Search, filter, assign rider, change order status, view items,
                timeline and customer order history.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => getOrders(page)}
                loading={loading}
                className="!h-11 !rounded-2xl !border-slate-200 !px-5 !font-bold"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Refresh
                </div>
              </Button>

              <Button
                onClick={goToday}
                className="!h-11 !rounded-2xl !border-blue-200 !px-5 !font-bold !text-blue-700"
              >
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  Today
                </div>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={totalOrders || rawPayload?.count || stats.loaded}
            helper="Total orders from server"
            icon={<ShoppingBag size={20} />}
            tone="blue"
          />

          <StatCard
            title="Visible Orders"
            value={stats.filtered}
            helper={`Loaded on current page: ${stats.loaded}`}
            icon={<ClipboardList size={20} />}
            tone="purple"
          />

          <StatCard
            title="Delivered Orders"
            value={stats.delivered}
            helper="Delivered/completed from visible result"
            icon={<CheckCircle2 size={20} />}
            tone="green"
          />

          <StatCard
            title="Visible Amount"
            value={money(stats.amount)}
            helper={`Delivery ${money(stats.delivery)} • Tips ${money(stats.tips)} • Platform ${money(stats.platformFee)}`}
            icon={<Wallet size={20} />}
            tone="amber"
          />
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Filter & Search Orders
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Narrow down by status, date, order id, user, restaurant, rider
                or customer phone.
              </p>
            </div>
            <Tag color="blue">Page {page}</Tag>
          </div>

          <div className="grid gap-3 xl:grid-cols-[190px_180px_1fr_170px_170px_auto]">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              className="w-full"
            />

            <Select
              value={searchType}
              onChange={setSearchType}
              options={[
                { value: "all", label: "Search all" },
                { value: "order", label: "Order ID" },
                { value: "user", label: "User ID" },
                { value: "phone", label: "Phone" },
                { value: "restaurant", label: "Restaurant" },
                { value: "rider", label: "Rider ID" },
              ]}
              className="w-full"
            />

            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search order, user, phone, restaurant or rider..."
              prefix={<Search size={15} className="text-slate-400" />}
              className="!rounded-xl"
            />

            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="!rounded-xl"
            />

            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="!rounded-xl"
            />

            <Button
              onClick={clearFilters}
              className="!h-10 !rounded-xl !border-slate-200 !font-semibold"
            >
              Clear
            </Button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="m-0 text-xl font-black text-slate-900">
                Order Directory
              </h2>

              <p className="m-0 mt-1 text-sm text-slate-500">
                Browse all orders and manage delivery workflow.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Tag color="blue">Loaded: {stats.loaded}</Tag>
              <Tag color="green">Showing: {stats.filtered}</Tag>
              <Tag color="purple">Page: {page}</Tag>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[2100px] w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-center text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                  {tableHeading.map((item) => (
                    <th key={item} className="px-4 py-4">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={tableHeading.length} className="px-4 py-10">
                      <CustomSkeleton />
                    </td>
                  </tr>
                ) : filteredOrders.length ? (
                  filteredOrders.map((order, index) => (
                    <OrderCard
                      key={order?._id || index}
                      order={order}
                      slNo={(page - 1) * ORDER_LIMIT + index}
                      getOrders={() => getOrders(page)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableHeading.length} className="px-4 py-12">
                      <Empty description="No orders found" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center border-t border-slate-100 bg-white px-4 py-5">
            <Pagination
              current={page}
              pageSize={ORDER_LIMIT}
              total={totalOrders || Math.max(page * ORDER_LIMIT, stats.loaded)}
              showSizeChanger={false}
              onChange={(nextPage) => setPage(nextPage)}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
