import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Empty,
  Input,
  Pagination,
  Popconfirm,
  Select,
  Spin,
  Tag,
  message,
} from "antd";
import {
  ArchiveRestore,
  CalendarDays,
  CreditCard,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Store,
  Trash2,
  UserRound,
  Wallet,
} from "lucide-react";
import Layout from "./layout";
import axiosInstance from "../services/axios/axiosInstance";

const PAGE_SIZE = 20;

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getOrderDate = (order) =>
  order?.orderDate || order?.createdAt || order?.updatedAt || "";

const getBangladeshDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const statusColor = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("deliver")) return "green";
  if (normalized.includes("cancel")) return "red";
  return "blue";
};

const money = (value) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatMoney = (value) =>
  `BDT ${money(value).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

const customerName = (order) =>
  order?.userId?.fullName ||
  order?.customerName ||
  order?.deliveryAddress?.name ||
  "Unknown Customer";

const customerPhone = (order) =>
  order?.userId?.phoneNumber ||
  order?.customerPhone ||
  order?.phoneNumber ||
  order?.deliveryAddress?.phoneNumber ||
  "N/A";

const restaurantName = (order) =>
  order?.restaurantId?.name ||
  order?.restaurantName ||
  "Unknown Restaurant";

const zoneName = (order) =>
  order?.zoneName ||
  order?.restaurantId?.zoneName ||
  (order?.zoneId ? `Zone #${order.zoneId}` : "N/A");

const paymentName = (order) =>
  String(
    order?.paymentMethod ||
      order?.peymentMethod ||
      order?.paymentType ||
      "N/A",
  ).replaceAll("_", " ");

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        <Icon size={13} />
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-slate-800">
        {children}
      </div>
    </div>
  );
}

function TrashOrderCard({ order, restoring, deleting, onRestore, onDelete }) {
  const orderId = String(order?._id || "");
  const tip = money(order?.tip ?? order?.tipAmount ?? order?.riderTips);

  return (
    <article className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-black text-blue-700">
              #{orderId.slice(-8).toUpperCase()}
            </span>
            <Tag color={statusColor(order?.status)}>{order?.status || "N/A"}</Tag>
            <Tag color="geekblue">{zoneName(order)}</Tag>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Order: {formatDate(getOrderDate(order))}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Popconfirm
            title="Restore this order?"
            description="The order will return to Order Management."
            onConfirm={() => onRestore(orderId)}
            okText="Restore"
          >
            <Button
              type="primary"
              icon={<ArchiveRestore size={15} />}
              loading={restoring}
            >
              Restore Order
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Permanently delete this order?"
            description="This cannot be undone. The order will be removed from the database."
            onConfirm={() => onDelete(orderId)}
            okText="Delete Permanently"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<Trash2 size={15} />}
              loading={deleting}
            >
              Delete Permanently
            </Button>
          </Popconfirm>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <Detail icon={Store} label="Restaurant">
          {restaurantName(order)}
        </Detail>
        <Detail icon={UserRound} label="Customer">
          <div>{customerName(order)}</div>
          <div className="mt-1 flex items-center gap-1 text-xs font-normal text-slate-500">
            <Phone size={12} /> {customerPhone(order)}
          </div>
        </Detail>
        <Detail icon={MapPin} label="Zone">
          {zoneName(order)}
        </Detail>
        <Detail icon={Wallet} label="Amount">
          <span className="text-emerald-700">
            {formatMoney(order?.totalAmount)}
          </span>
          <div className="mt-1 text-xs font-normal text-slate-500">
            Delivery {formatMoney(order?.deliveryAmount)}
            {tip > 0 ? ` • Tip ${formatMoney(tip)}` : ""}
          </div>
        </Detail>
        <Detail icon={CreditCard} label="Payment">
          <span className="capitalize">{paymentName(order)}</span>
        </Detail>
        <Detail icon={CalendarDays} label="Archived at">
          {formatDate(order?.archivedAt)}
        </Detail>
        <div className="sm:col-span-2">
          <Detail icon={Trash2} label="Archive reason">
            <span className="block whitespace-normal leading-6">
              {order?.archiveReason || "Archived from Order Management"}
            </span>
          </Detail>
        </div>
      </div>
    </article>
  );
}

export default function OrderTrash() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");

  const loadArchivedOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/orders/archived", {
        params: { page, limit: PAGE_SIZE },
      });
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
      setTotal(Number(data?.count || 0));
    } catch (error) {
      setOrders([]);
      setTotal(0);
      message.error(
        error?.response?.data?.message || "Failed to load Order Trash.",
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadArchivedOrders();
  }, [loadArchivedOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const orderStatus = String(order?.status || "").toLowerCase();
      const matchesStatus = status === "all" || orderStatus === status;
      const matchesDate =
        !date || getBangladeshDate(getOrderDate(order)) === date;
      const matchesSearch =
        !query ||
        [
          order?._id,
          customerName(order),
          customerPhone(order),
          restaurantName(order),
          zoneName(order),
        ].some((value) =>
          String(value || "").toLowerCase().includes(query),
        );
      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [date, orders, search, status]);

  const restoreOrder = async (orderId) => {
    try {
      setRestoringId(orderId);
      const { data } = await axiosInstance.patch(
        `/admin/order/${orderId}/restore`,
      );
      message.success(data?.message || "Order restored successfully.");
      await loadArchivedOrders();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to restore order.",
      );
    } finally {
      setRestoringId("");
    }
  };

  const permanentlyDeleteOrder = async (orderId) => {
    try {
      setDeletingId(orderId);
      const { data } = await axiosInstance.delete(
        `/admin/order/${orderId}/permanent`,
      );
      message.success(data?.message || "Order permanently deleted.");

      if (orders.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadArchivedOrders();
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Failed to permanently delete archived order.",
      );
    } finally {
      setDeletingId("");
    }
  };
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-3 md:p-6">
        <div className="mx-auto max-w-7xl space-y-5">
          <section className="rounded-[30px] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">
                  Recoverable order archive
                </p>
                <h1 className="mt-2 flex items-center gap-3 text-3xl font-black">
                  <Trash2 /> Order Trash
                </h1>
                <p className="mt-2 text-sm text-slate-300">
                  Trash order Dashboard বা active order count-এ দেখানো হবে না।
                </p>
              </div>
              <Button
                icon={<RefreshCw size={16} />}
                loading={loading}
                onClick={loadArchivedOrders}
              >
                Refresh
              </Button>
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                prefix={<Search size={15} />}
                placeholder="Order, phone, restaurant or zone..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                allowClear
              />
              <Select
                value={status}
                onChange={setStatus}
                options={[
                  { value: "all", label: "All status" },
                  { value: "cancelled", label: "Cancelled" },
                  {
                    value: "cancelled by restaurant",
                    label: "Cancelled by restaurant",
                  },
                  { value: "delivered", label: "Delivered" },
                ]}
              />
              <Input
                type="date"
                prefix={<CalendarDays size={15} />}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
          </section>

          <Spin spinning={loading}>
            <section className="space-y-4">
              {!loading && filteredOrders.length === 0 ? (
                <div className="rounded-[26px] border border-slate-200 bg-white py-16">
                  <Empty description="Order Trash is empty" />
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <TrashOrderCard
                    key={order._id}
                    order={order}
                    restoring={restoringId === order._id}
                    deleting={deletingId === order._id}
                    onRestore={restoreOrder}
                    onDelete={permanentlyDeleteOrder}
                  />
                ))
              )}
            </section>
          </Spin>

          {total > PAGE_SIZE ? (
            <div className="flex justify-center rounded-2xl border border-slate-200 bg-white p-4">
              <Pagination
                current={page}
                pageSize={PAGE_SIZE}
                total={total}
                showSizeChanger={false}
                onChange={setPage}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
