import { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import { Button, Empty, Spin, Tag } from "antd";
import {
  BellOutlined,
  DeleteOutlined,
  ReloadOutlined,
  NotificationOutlined,
  PictureOutlined,
  ThunderboltOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import axiosInstance from "../services/axios/axiosInstance";
import { resolveImageUrl, useImageFallback } from "../helpers/imageUrl";

function AllNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/notification/notifications?limit=5"
      );
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        alert(data.message || "Failed to load notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    return () => console.log("component unmount.");
  }, []);

  async function handleDelete(id) {
    try {
      setLoading(true);
      const { data } = await axiosInstance.delete(`/notification/${id}`);
      if (data.success) {
        alert(data.message);
      } else {
        alert("Failedt to delete notification.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      fetchNotifications();
    }
  }

  const totalNotifications = notifications.length;
  const totalPromotions = useMemo(
    () => notifications.filter((item) => item?.isPromotion).length,
    [notifications]
  );
  const totalWithImages = useMemo(
    () => notifications.filter((item) => item?.image).length,
    [notifications]
  );

  return (
    <Layout>
      <div className="mx-auto max-w-[1450px] px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-500 text-white shadow-lg shadow-blue-200/50">
                <BellOutlined className="text-[28px]" />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-500">
                  <ThunderboltOutlined />
                  Notification Control Center
                </div>

                <h1 className="m-0 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  All Notifications
                </h1>

                <p className="mt-2 text-sm text-slate-500 md:text-base">
                  Review system notifications, promotions and media alerts from
                  one clean admin view.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setLoading(true);
                  fetchNotifications();
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
            icon={<NotificationOutlined />}
            label="Total Notifications"
            value={totalNotifications}
            helper="Latest loaded notification count"
            color="blue"
          />
          <StatCard
            icon={<TagsOutlined />}
            label="Promotions"
            value={totalPromotions}
            helper="Marked promotional notifications"
            color="emerald"
          />
          <StatCard
            icon={<PictureOutlined />}
            label="With Images"
            value={totalWithImages}
            helper="Notifications containing banner/image"
            color="amber"
          />
        </div>

        {/* Body */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="m-0 text-xl font-extrabold text-slate-900">
                  Notification Feed
                </h3>
                <p className="m-0 mt-1 text-sm text-slate-500">
                  View title, description, type, promotion status and attached
                  images.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                  Total: {totalNotifications}
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  Promotions: {totalPromotions}
                </div>
                <div className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                  Images: {totalWithImages}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6">
            {loading ? (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="text-center">
                  <Spin size="large" />
                  <p className="mt-4 text-sm font-medium text-slate-500">
                    Loading notifications...
                  </p>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16">
                <Empty description="No notifications found" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {notifications.map((item) => (
                  <div
                    key={item._id}
                    className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    {item.image ? (
                      <div className="aspect-[16/7] w-full overflow-hidden bg-slate-100">
                        <img
                          src={resolveImageUrl(item.image)}
                          alt="Notification"
                          className="h-full w-full object-cover"
                          onError={useImageFallback}
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-gradient-to-r from-slate-50 to-slate-100 text-slate-400">
                        <div className="text-center">
                          <PictureOutlined className="text-3xl" />
                          <p className="mt-2 text-sm font-medium">
                            No image attached
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Tag className="rounded-full border-0 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                          {item.type || "General"}
                        </Tag>

                        <Tag
                          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${
                            item.isPromotion
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.isPromotion ? "Promotion" : "Standard"}
                        </Tag>
                      </div>

                      <h2 className="text-xl font-bold tracking-tight text-slate-900">
                        {item.title}
                      </h2>

                      <p className="mt-2 line-clamp-4 text-sm leading-7 text-slate-600">
                        {item.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div className="text-xs text-slate-400">
                          ID: {item._id?.slice(-8)}
                        </div>

                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          className="!rounded-xl !font-semibold"
                          onClick={() => {
                            const userConfirm = confirm("Are you sure?");
                            if (userConfirm) {
                              handleDelete(item._id);
                            } else {
                              console.log("Cancel delete request.");
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

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

export default AllNotification;
