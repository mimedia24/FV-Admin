import { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import UserCard from "../components/user/userCard";
import { Input, Button, Empty, Modal, Spin, Tag } from "antd";
import Pagination from "../components/pagination/Pagination";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
  TrophyOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const userTableHeading = [
  { title: "Sl no" },
  { title: "ID" },
  { title: "Avater" },
  { title: "Status" },
  { title: "Name" },
  { title: "Email" },
  { title: "Phone" },
  { title: "Home" },
  { title: "Office" },
  { title: "Others" },
  { title: "Action" },
];

const statThemes = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-600",
    border: "border-blue-200",
    glow: "shadow-[0_10px_40px_rgba(37,99,235,0.10)]",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-600",
    border: "border-emerald-200",
    glow: "shadow-[0_10px_40px_rgba(16,185,129,0.10)]",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-600",
    border: "border-amber-200",
    glow: "shadow-[0_10px_40px_rgba(245,158,11,0.10)]",
  },
  rose: {
    iconBg: "bg-rose-500/10",
    iconText: "text-rose-600",
    border: "border-rose-200",
    glow: "shadow-[0_10px_40px_rgba(244,63,94,0.10)]",
  },
  violet: {
    iconBg: "bg-violet-500/10",
    iconText: "text-violet-600",
    border: "border-violet-200",
    glow: "shadow-[0_10px_40px_rgba(124,58,237,0.10)]",
  },
};

const toNumber = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (value) =>
  `BDT ${Math.round(toNumber(value)).toLocaleString("en-BD")}`;

function isVerifiedUser(user) {
  return (
    user?.isVerify === true ||
    user?.isverify === true ||
    user?.isVerified === true ||
    user?.verified === true ||
    user?.otpVerified === true ||
    String(user?.isVerify).toLowerCase() === "true" ||
    String(user?.isverify).toLowerCase() === "true" ||
    String(user?.isVerified).toLowerCase() === "true"
  );
}

function extractUsers(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.user)) return payload.user;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.resource)) return payload.resource;
  if (Array.isArray(payload?.data?.users)) return payload.data.users;
  if (Array.isArray(payload?.result?.users)) return payload.result.users;
  return [];
}

function extractOrders(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.order)) return payload.order;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.resource)) return payload.resource;
  if (Array.isArray(payload?.data?.orders)) return payload.data.orders;
  if (Array.isArray(payload?.result?.orders)) return payload.result.orders;
  return [];
}

function extractTotalCount(payload, fallback = 0) {
  return (
    toNumber(payload?.count) ||
    toNumber(payload?.total) ||
    toNumber(payload?.totalCount) ||
    toNumber(payload?.totalUsers) ||
    toNumber(payload?.data?.count) ||
    toNumber(payload?.data?.total) ||
    toNumber(payload?.data?.totalCount) ||
    fallback
  );
}

function getOrderUserId(order) {
  if (typeof order?.userId === "object") {
    return order?.userId?._id || order?.userId?.id || "";
  }

  return (
    order?.userId ||
    order?.user ||
    order?.customerId ||
    order?.user_id ||
    order?.customer?._id ||
    ""
  );
}

function getOrderAmount(order) {
  const directAmount =
    toNumber(order?.totalAfterVoucherApplied) ||
    toNumber(order?.finalAmount) ||
    toNumber(order?.payableAmount) ||
    toNumber(order?.grandTotal) ||
    toNumber(order?.totalAmount) ||
    toNumber(order?.orderAmount);

  if (directAmount > 0) return directAmount;

  const itemsTotal = (Array.isArray(order?.items) ? order.items : []).reduce(
    (sum, item) => {
      const offerPrice = toNumber(item?.offerPrice);
      const sellingPrice = toNumber(item?.sellingPrice);
      const price = toNumber(item?.price);
      const basedPrice = toNumber(item?.basedPrice);
      const platformFee = toNumber(item?.plateformFee ?? item?.platformFee);
      const discountRate = toNumber(item?.discountRate);

      let unitPrice = offerPrice || sellingPrice || price;

      if (!unitPrice && (basedPrice > 0 || platformFee > 0)) {
        const beforeDiscount = basedPrice + platformFee;
        unitPrice = Math.max(
          0,
          beforeDiscount - (beforeDiscount * discountRate) / 100
        );
      }

      return sum + unitPrice * toNumber(item?.quantity || 1);
    },
    0
  );

  const deliveryAmount = toNumber(order?.deliveryAmount ?? order?.deliveryFee);
  const riderTip =
    toNumber(order?.tip) ||
    toNumber(order?.riderTip) ||
    toNumber(order?.riderTips);
  const orderPlatformFee = toNumber(
    order?.orderPlatformFee ??
      order?.orderPlatformFeeSnapshot?.effectiveAmount ??
      0
  );
  const voucherAmount =
    toNumber(order?.voucherAmount) ||
    toNumber(order?.voucherDiscount) ||
    toNumber(order?.discountAmount);

  return Math.max(
    0,
    itemsTotal + deliveryAmount + riderTip + orderPlatformFee - voucherAmount
  );
}

function getOrderDate(order) {
  return (
    order?.orderDate ||
    order?.createdAt ||
    order?.date ||
    order?.updateTime ||
    order?.updatedAt ||
    null
  );
}

function buildTopUsers({ orders = [], users = [], type = "orders" }) {
  const userMap = new Map();

  users.forEach((user) => {
    const id = user?._id || user?.id;
    if (id) {
      userMap.set(String(id), user);
    }
  });

  const grouped = new Map();

  orders.forEach((order) => {
    const userId = getOrderUserId(order);
    if (!userId) return;

    const key = String(userId);
    const amount = getOrderAmount(order);
    const userDetail = userMap.get(key);

    const existing =
      grouped.get(key) || {
        userId: key,
        name:
          userDetail?.fullName ||
          userDetail?.name ||
          order?.customerName ||
          order?.userName ||
          "Unknown User",
        phone:
          userDetail?.phoneNumber ||
          userDetail?.phone ||
          order?.customerPhone ||
          "N/A",
        email: userDetail?.email || order?.customerEmail || "N/A",
        orderCount: 0,
        totalAmount: 0,
        lastOrderDate: null,
      };

    existing.orderCount += 1;
    existing.totalAmount += amount;

    const orderDate = getOrderDate(order);
    if (
      orderDate &&
      (!existing.lastOrderDate ||
        new Date(orderDate).getTime() > new Date(existing.lastOrderDate).getTime())
    ) {
      existing.lastOrderDate = orderDate;
    }

    grouped.set(key, existing);
  });

  const list = Array.from(grouped.values());

  if (type === "amount") {
    return list.sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 20);
  }

  return list.sort((a, b) => b.orderCount - a.orderCount).slice(0, 20);
}

export default function UserManagement() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userSummary, setUserSummary] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
  });

  const [topModalOpen, setTopModalOpen] = useState(false);
  const [topModalType, setTopModalType] = useState("orders");
  const [topLoading, setTopLoading] = useState(false);
  const [topUsers, setTopUsers] = useState([]);

  const { data, loading } = useFetch(
    `/admin/list-of-users?page=${page}&limit=20`,
    {}
  );

  useEffect(() => {
    setUser(data?.users || []);
  }, [data]);

  async function fetchAllUsersForSummary() {
    try {
      setSummaryLoading(true);

      const { data: response } = await axios.get(
        `${apiPath}/admin/list-of-users?page=1&limit=100000`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      let users = extractUsers(response);

      if (!users.length) {
        const fallback = await axios.get(`${apiPath}/admin/list-of-users`, {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        });

        users = extractUsers(fallback.data);
      }

      const totalUsers = extractTotalCount(response, users.length);
      const verifiedUsers = users.filter(isVerifiedUser).length;
      const unverifiedUsers = Math.max(totalUsers - verifiedUsers, 0);

      setAllUsers(users);
      setUserSummary({
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
      });
    } catch (error) {
      console.log("Failed to fetch all users summary:", error);
      setAllUsers([]);
      setUserSummary({
        totalUsers: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
      });
    } finally {
      setSummaryLoading(false);
    }
  }

  useEffect(() => {
    fetchAllUsersForSummary();
  }, []);

  async function handleSearchByPhone(phoneNumber) {
    if (!phoneNumber) {
      setUser(data?.users || []);
      return;
    }

    try {
      const { data } = await axios.get(
        `${apiPath}/admin/search-user-by-phone-number?phoneNumber=${phoneNumber}`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (data.success) {
        setUser(data.user ? [data.user] : []);
      } else {
        setUser([]);
      }
    } catch (error) {
      console.log("search by phone error : ", error);
      setUser([]);
    }
  }

  async function handleSearchByUserId(userId) {
    if (!userId) {
      setUser(data?.users || []);
      return;
    }

    try {
      const { data } = await axios.get(`${apiPath}/admin/user/${userId}`, {
        headers: {
          "x-auth-token": apiAuthToken,
        },
      });

      if (data.success) {
        setUser(data.user ? [data.user] : []);
      } else {
        setUser([]);
      }
    } catch (error) {
      console.log("search by user id error : ", error);
      setUser([]);
    }
  }

  async function fetchAllOrdersForTopUsers() {
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-orders?page=1&limit=100000`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      let orders = extractOrders(data);

      if (!orders.length) {
        const fallback = await axios.get(`${apiPath}/admin/list-of-orders`, {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        });

        orders = extractOrders(fallback.data);
      }

      return orders;
    } catch (error) {
      console.log("Failed to fetch orders for top users:", error);
      return [];
    }
  }

  async function handleShowTopUsers(type) {
    try {
      setTopModalType(type);
      setTopModalOpen(true);
      setTopLoading(true);
      setTopUsers([]);

      let usersForAnalytics = allUsers;

      if (!usersForAnalytics.length) {
        await fetchAllUsersForSummary();
        usersForAnalytics = allUsers;
      }

      const orders = await fetchAllOrdersForTopUsers();

      const result = buildTopUsers({
        orders,
        users: usersForAnalytics,
        type,
      });

      setTopUsers(result);
    } catch (error) {
      console.log("Top user calculation failed:", error);
      setTopUsers([]);
    } finally {
      setTopLoading(false);
    }
  }

  const onSearchByUserId = (value) => {
    handleSearchByUserId(value);
  };

  const onSearch = (value) => {
    handleSearchByPhone(value);
  };

  const tableUsers = useMemo(() => {
    return Array.isArray(user) ? user : [];
  }, [user]);

  return (
    <Layout>
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/50">
                <UserOutlined className="text-[28px]" />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-500">
                  <ThunderboltOutlined />
                  User Directory Control
                </div>

                <h1 className="m-0 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  User Management
                </h1>

                <p className="mt-2 text-sm text-slate-500 md:text-base">
                  Search, review, verified users and top order customers from one admin workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                icon={<TrophyOutlined />}
                onClick={() => handleShowTopUsers("orders")}
                className="!h-11 !rounded-xl !border-blue-200 !bg-blue-50 !text-blue-700 !font-bold"
              >
                See Top Ordered Users
              </Button>

              <Button
                icon={<DollarCircleOutlined />}
                onClick={() => handleShowTopUsers("amount")}
                className="!h-11 !rounded-xl !border-emerald-200 !bg-emerald-50 !text-emerald-700 !font-bold"
              >
                See Top Amount Users
              </Button>

              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchAllUsersForSummary();
                  window.location.reload();
                }}
                className="!h-11 !rounded-xl !border-slate-200 !text-slate-600 !font-semibold"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<TeamOutlined />}
            label="Total Users"
            value={userSummary.totalUsers}
            helper="All registered users in system"
            color="blue"
            loading={summaryLoading}
          />

          <StatCard
            icon={<SafetyCertificateOutlined />}
            label="Verified Users"
            value={userSummary.verifiedUsers}
            helper="Users verified by OTP / isVerify"
            color="emerald"
            loading={summaryLoading}
          />

          <StatCard
            icon={<StopOutlined />}
            label="Unverified Users"
            value={userSummary.unverifiedUsers}
            helper="Users who did not complete OTP verification"
            color="rose"
            loading={summaryLoading}
          />
        </div>

        {/* Search Area */}
        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="m-0 text-xl font-extrabold text-slate-900">
                Search Users
              </h3>
              <p className="m-0 mt-1 text-sm text-slate-500">
                Find users instantly by phone number or user id.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                icon={<TrophyOutlined />}
                onClick={() => handleShowTopUsers("orders")}
                className="!rounded-xl !font-bold"
              >
                Top 20 Order Users
              </Button>

              <Button
                icon={<DollarCircleOutlined />}
                onClick={() => handleShowTopUsers("amount")}
                className="!rounded-xl !font-bold"
              >
                Top 20 Amount Users
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <PhoneOutlined className="text-blue-600" />
                Search by Phone
              </div>

              <Search
                placeholder="search user by phone"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
                className="user-search-box"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <IdcardOutlined className="text-violet-600" />
                Search by User ID
              </div>

              <Search
                placeholder="search user by user id"
                allowClear
                enterButton="User ID"
                size="large"
                onSearch={onSearchByUserId}
                className="user-search-box"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="m-0 text-xl font-extrabold text-slate-900">
                  User Directory
                </h3>
                <p className="m-0 mt-1 text-sm text-slate-500">
                  View user profile details, addresses and account status.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                  Total: {userSummary.totalUsers}
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  Verified: {userSummary.verifiedUsers}
                </div>
                <div className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600">
                  Unverified: {userSummary.unverifiedUsers}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto p-4 md:p-6">
            {!tableUsers || tableUsers.length === 0 ? (
              <div className="py-16">
                {loading ? (
                  <div className="w-fit mx-auto">
                    <CustomSkeleton />
                  </div>
                ) : (
                  <Empty description="No users found" />
                )}
              </div>
            ) : (
              <table className="w-full min-w-[1300px] overflow-hidden rounded-2xl border border-slate-200">
                <thead>
                  <tr className="bg-slate-50">
                    {userTableHeading.map((title, index) => (
                      <th
                        key={index}
                        className="border-b border-slate-200 px-3 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.08em] text-slate-500"
                      >
                        {title.title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {tableUsers.map((userItem, index) => (
                    <UserCard
                      slNO={index}
                      detail={userItem}
                      key={userItem?._id}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Pagination updatePage={setPage} currentPage={page} />
          </div>
        </div>
      </div>

      <TopUsersModal
        open={topModalOpen}
        type={topModalType}
        loading={topLoading}
        users={topUsers}
        onCancel={() => setTopModalOpen(false)}
      />

      <style>{`
        .user-search-box .ant-input,
        .user-search-box .ant-input-search-button {
          height: 48px !important;
        }

        .user-search-box .ant-input {
          border-radius: 14px 0 0 14px !important;
        }

        .user-search-box .ant-input-search-button {
          border-radius: 0 14px 14px 0 !important;
          font-weight: 700 !important;
        }
      `}</style>
    </Layout>
  );
}

const StatCard = ({ icon, label, value, helper, color = "blue", loading }) => {
  const theme = statThemes[color] || statThemes.blue;

  return (
    <div
      className={`rounded-[24px] border bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${theme.border} ${theme.glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>

          <div className="text-3xl font-black leading-none text-slate-900">
            {loading ? <Spin size="small" /> : value || 0}
          </div>

          <div className="mt-3 text-sm text-slate-500">{helper}</div>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${theme.iconBg} ${theme.iconText}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

function TopUsersModal({ open, type, loading, users, onCancel }) {
  const title =
    type === "amount"
      ? "Top 20 Users by Order Amount"
      : "Top 20 Users by Order Count";

  return (
    <Modal
      title={
        <div>
          <h2 className="m-0 text-xl font-black text-slate-900">{title}</h2>
          <p className="m-0 mt-1 text-sm text-slate-500">
            Calculated from all available orders.
          </p>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={950}
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Spin />
        </div>
      ) : users?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] overflow-hidden rounded-2xl border border-slate-200">
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3 text-center">Rank</th>
                <th className="px-3 py-3 text-left">User</th>
                <th className="px-3 py-3 text-left">Phone</th>
                <th className="px-3 py-3 text-center">Orders</th>
                <th className="px-3 py-3 text-center">Total Amount</th>
                <th className="px-3 py-3 text-center">Last Order</th>
                <th className="px-3 py-3 text-center">History</th>
              </tr>
            </thead>

            <tbody>
              {users.map((item, index) => (
                <tr
                  key={item.userId}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-3 text-center">
                    <Tag
                      color={index < 3 ? "gold" : "blue"}
                      className="rounded-full font-bold"
                    >
                      #{index + 1}
                    </Tag>
                  </td>

                  <td className="px-3 py-3">
                    <div className="font-bold text-slate-800">
                      {item.name || "Unknown User"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.userId}
                    </div>
                  </td>

                  <td className="px-3 py-3 text-slate-700">
                    {item.phone || "N/A"}
                  </td>

                  <td className="px-3 py-3 text-center font-black text-blue-600">
                    {item.orderCount}
                  </td>

                  <td className="px-3 py-3 text-center font-black text-emerald-600">
                    {formatMoney(item.totalAmount)}
                  </td>

                  <td className="px-3 py-3 text-center text-[12px] text-slate-500">
                    {item.lastOrderDate
                      ? new Date(item.lastOrderDate).toLocaleString("en-BD")
                      : "N/A"}
                  </td>

                  <td className="px-3 py-3 text-center">
                    <Button size="small">
                      <Link to={`/order-history?id=${item.userId}`}>
                        View
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty description="No top users found" />
      )}
    </Modal>
  );
}
