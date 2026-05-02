import React, { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import UserCard from "../components/user/userCard";
import { Input, Button, Empty } from "antd";
import Pagination from "../components/pagination/Pagination";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import {
  UserOutlined,
  SearchOutlined,
  PhoneOutlined,
  IdcardOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
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
};

export default function UserManagement() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);

  async function handleSearchByPhone(phoneNumber) {
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
        const userArr = [];
        userArr.push(data.user);
        setUser(userArr);
      }
    } catch (error) {
      console.log("search by phone errro : ", error);
    }
  }

  async function handleSearchByUserId(userId) {
    try {
      const { data } = await axios.get(`${apiPath}/admin/user/${userId}`, {
        headers: {
          "x-auth-token": apiAuthToken,
        },
      });

      if (data.success) {
        const userArr = [];
        userArr.push(data.user);
        setUser(userArr);
      }
    } catch (error) {
      console.log("search by phone errro : ", error);
    }
  }

  function onSearchByUserId(value, e, info) {
    handleSearchByUserId(value);
  }

  const onSearch = (value, _e, info) => {
    handleSearchByPhone(value);
  };

  const { data, loading } = useFetch(
    `/admin/list-of-users?page=${page}&limit=20`,
    {}
  );

  useEffect(() => {
    setUser(data?.users);
  }, [data]);

  useEffect(() => {
    console.log("users list is : ", user);
  }, [user]);

  const totalLoadedUsers = user?.length || 0;
  const activeUsers =
    user?.filter(
      (item) =>
        item?.isActive === true ||
        item?.status === true ||
        item?.status === "active"
    )?.length || 0;

  const inactiveUsers = Math.max(totalLoadedUsers - activeUsers, 0);

  const pageLabel = useMemo(() => `Page ${page}`, [page]);

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
                  Search, review and manage all registered users from one clean
                  admin workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
                className="!h-11 !rounded-xl !border-slate-200 !text-slate-600 !font-semibold"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<TeamOutlined />}
            label="Loaded Users"
            value={totalLoadedUsers}
            helper="Users currently visible in this page/search"
            color="blue"
          />
          <StatCard
            icon={<SafetyCertificateOutlined />}
            label="Active Users"
            value={activeUsers}
            helper="Detected from loaded user rows"
            color="emerald"
          />
          <StatCard
            icon={<UserOutlined />}
            label="Inactive Users"
            value={inactiveUsers}
            helper="Remaining users from current result"
            color="amber"
          />
          <StatCard
            icon={<IdcardOutlined />}
            label="Current Page"
            value={page}
            helper={pageLabel}
            color="blue"
          />
        </div>

        {/* Search Area */}
        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <h3 className="m-0 text-xl font-extrabold text-slate-900">
              Search Users
            </h3>
            <p className="m-0 mt-1 text-sm text-slate-500">
              Find users instantly by phone number or user id.
            </p>
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
                  Users: {totalLoadedUsers}
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  Active: {activeUsers}
                </div>
                <div className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                  Page: {page}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto p-4 md:p-6">
            {!user || user.length === 0 ? (
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
                  {user.map((userItem, index) => (
                    <UserCard slNO={index} detail={userItem} key={userItem?._id} />
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

const StatCard = ({ icon, label, value, helper, color = "blue" }) => {
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
            {value || 0}
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