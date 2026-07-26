import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Empty,
  Input,
  Pagination,
  Popconfirm,
  Select,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import {
  ArchiveRestore,
  CalendarDays,
  RefreshCw,
  Search,
  Trash2,
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

export default function OrderTrash() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState("");
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
      const statusMatched = status === "all" || orderStatus === status;
      const dateMatched =
        !date || getBangladeshDate(getOrderDate(order)) === date;
      const searchMatched =
        !query ||
        [
          order?._id,
          order?.customerPhone,
          order?.restaurantName,
          order?.restaurantId,
          order?.riderId,
          order?.userId,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
        );
      return statusMatched && dateMatched && searchMatched;
    });
  }, [orders, search, status, date]);

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

  const columns = [
    {
      title: "Order",
      dataIndex: "_id",
      width: 160,
      render: (value) => (
        <span className="font-bold text-blue-600">
          #{String(value || "").slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      title: "Restaurant",
      dataIndex: "restaurantName",
      render: (value) => value || "Unknown Restaurant",
    },
    {
      title: "Customer",
      dataIndex: "customerPhone",
      render: (value) => value || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 180,
      render: (value) => (
        <Tag color={statusColor(value)} className="capitalize">
          {value || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Reason",
      dataIndex: "archiveReason",
      render: (value) => value || "Archived from Order Management",
    },
    {
      title: "Order date",
      width: 190,
      render: (_, order) => formatDate(getOrderDate(order)),
    },
    {
      title: "Archived at",
      dataIndex: "archivedAt",
      width: 190,
      render: formatDate,
    },
    {
      title: "Action",
      fixed: "right",
      width: 130,
      render: (_, order) => (
        <Popconfirm
          title="Restore this order?"
          description="The order will return to the normal order directory."
          onConfirm={() => restoreOrder(order._id)}
          okText="Restore"
        >
          <Button
            type="primary"
            icon={<ArchiveRestore size={15} />}
            loading={restoringId === order._id}
          >
            Restore
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-5">
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
                Archived orders remain available here until they are restored.
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
              placeholder="Order, phone, restaurant, rider..."
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

        <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
          <Spin spinning={loading}>
            <Table
              rowKey="_id"
              dataSource={filteredOrders}
              columns={columns}
              pagination={false}
              scroll={{ x: 1300 }}
              locale={{ emptyText: <Empty description="Order Trash is empty" /> }}
            />
          </Spin>
          <div className="flex justify-center border-t border-slate-100 p-4">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={total}
              showSizeChanger={false}
              onChange={setPage}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
