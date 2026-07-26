import { useEffect, useState } from "react";
import {
  Button,
  Space,
  Typography,
  message,
  Empty,
  Tabs,
  Table,
  Tag,
  Popconfirm,
  Badge,
  Tooltip,
  Image,
} from "antd";
import {
  ReloadOutlined,
  GiftOutlined,
  TagOutlined,
  NotificationOutlined,
  DeleteOutlined,
  UserOutlined,
  EditOutlined,
  EyeOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Layout from "./layout";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import OfferCard from "../components/offer/OfferCard";
import CustomSkeleton from "../components/skeleton";
import AddOfferModal from "../components/offer/AddOfferModal";
import AddVoucher from "../components/offer/AddVoucher";
import axiosInstance from "../services/axios/axiosInstance";
import UpdateVoucher from "../components/offer/UpdateVoucher";
import { resolveImageUrl } from "../helpers/imageUrl";

const { Title, Text } = Typography;

const statThemes = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-500",
    border: "border-blue-500/20",
    glow: "shadow-[0_0_0_1px_rgba(59,130,246,0.10)]",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-500",
    border: "border-emerald-500/20",
    glow: "shadow-[0_0_0_1px_rgba(16,185,129,0.10)]",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-500",
    border: "border-amber-500/20",
    glow: "shadow-[0_0_0_1px_rgba(245,158,11,0.10)]",
  },
};

export default function Offermanagement() {
  const [advertisement, setAdvertisement] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const offerRes = await axios.get(`${apiPath}/offer/all-offer`, {
        headers: { "x-auth-token": apiAuthToken },
      });

      if (offerRes.data.success) {
        setAdvertisement(offerRes.data.response.offer);
      }

      const voucherRes = await axiosInstance.get(`/v3/master-admin/voucher`);
      if (voucherRes.data.success) {
        setVouchers(voucherRes.data.result.data || []);
      }
    } catch {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditVoucher = (record) => {
    setEditingVoucher(record);
    setIsUpdateModalOpen(true);
  };

  async function handleDeleteVoucher(voucherId) {
    try {
      const { data } = await axiosInstance.delete(
        `/v3/master-admin/voucher/${voucherId}`
      );
      if (data.success) {
        message.success("Voucher deleted successfully");
        fetchData();
      }
    } catch (error) {
      message.error("Failed to delete voucher");
      console.log("[Failed to delete voucher]", error);
    }
  }

  const voucherColumns = [
    {
      title: "Image",
      key: "image",
      width: 110,
      render: (_, record) => (
        <div className="flex items-center">
          <Image
            width={56}
            height={56}
            className="rounded-2xl object-cover border border-slate-200 shadow-sm"
            src={resolveImageUrl(record.image)}
            fallback={resolveImageUrl()}
            preview={{ mask: <EyeOutlined className="text-white" /> }}
          />
        </div>
      ),
    },
    {
      title: "Voucher Info",
      key: "info",
      fixed: "left",
      width: 220,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag
              color="gold"
              className="font-bold uppercase rounded-full px-3 py-[2px] m-0"
            >
              {record.code}
            </Tag>
            {record.autoApply && (
              <Tag
                color="blue"
                className="rounded-full text-[10px] px-2 py-[1px] m-0"
              >
                Auto Apply
              </Tag>
            )}
            {record.firsOrderOnly && (
              <Tag
                color="purple"
                className="rounded-full text-[10px] px-2 py-[1px] m-0"
              >
                First Order
              </Tag>
            )}
          </div>
          <Text className="text-[12px] text-slate-500">
            ID: {record?._id?.slice(-6)}
          </Text>
        </div>
      ),
    },
    {
      title: "Benefit",
      key: "value",
      width: 180,
      render: (_, record) => (
        <div className="flex flex-col">
          <Text className="text-emerald-600 font-extrabold text-base">
            {record.type === "PERCENTAGE"
              ? `${record.value}% OFF`
              : `$${record.value} Fixed`}
          </Text>
          <Text className="text-slate-500 text-[12px]">
            Min Cart: ${record.minCartAmount}
          </Text>
        </div>
      ),
    },
    {
      title: "Usage Status",
      key: "usage",
      width: 180,
      render: (_, record) => {
        const consumed = record.usedCount || 0;
        const total = record.usageLimit || 1;
        const percentage = Math.min(
          Math.round((consumed / total) * 100),
          100
        );

        return (
          <div className="flex flex-col w-full gap-1">
            <div className="flex justify-between items-center">
              <Text className="text-slate-500 text-[12px]">
                {consumed}/{total}
              </Text>
              <Text className="text-amber-600 text-[12px] font-bold">
                {percentage}%
              </Text>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (active) => (
        <Badge
          status={active ? "success" : "error"}
          text={
            <span
              style={{
                color: active ? "#10b981" : "#ef4444",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {active ? "Active" : "Disabled"}
            </span>
          }
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Voucher">
            <Button
              type="text"
              className="!text-blue-500 hover:!text-blue-600"
              icon={<EditOutlined />}
              onClick={() => handleEditVoucher(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Are you sure to delete this voucher?"
            onConfirm={() => handleDeleteVoucher(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalRedemptions = vouchers.reduce(
    (acc, curr) => acc + (curr.usedCount || 0),
    0
  );

  return (
    <Layout>
      <div className="max-w-[1450px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Top Header */}
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-6 md:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/60">
                <NotificationOutlined className="text-white text-[28px]" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-[0.20em] mb-3">
                  <ThunderboltOutlined />
                  Voucher & Banner Dashboard
                </div>

                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontWeight: 800,
                    lineHeight: 1.15,
                  }}
                >
                  Campaign Management
                </Title>

                <Text className="text-slate-500 text-sm md:text-base">
                  Manage advertisement banners and voucher campaigns from one
                  clean control panel.
                </Text>
              </div>
            </div>

            <Space wrap size="middle">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchData}
                className="!h-11 !rounded-xl !border-slate-200 !text-slate-600 !font-semibold"
              >
                Refresh
              </Button>

              <Button
                type="primary"
                size="large"
                icon={<GiftOutlined />}
                className="!h-11 !rounded-xl !px-6 !font-bold !border-none !bg-gradient-to-r !from-emerald-500 !to-emerald-600 hover:!from-emerald-600 hover:!to-emerald-700 shadow-md"
                onClick={() => {
                  setEditingVoucher(null);
                  setIsVoucherModalOpen(true);
                }}
              >
                Create Voucher
              </Button>

              <div className="[&>button]:!h-11 [&>button]:!rounded-xl [&>button]:!px-6 [&>button]:!font-bold">
                <AddOfferModal onSuccess={fetchData} />
              </div>
            </Space>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
          <StatCard
            icon={<TagOutlined />}
            label="Live Offers"
            value={advertisement?.length}
            helper="Published banner campaigns"
            color="blue"
          />
          <StatCard
            icon={<GiftOutlined />}
            label="Total Vouchers"
            value={vouchers?.length}
            helper="All available voucher codes"
            color="emerald"
          />
          <StatCard
            icon={<UserOutlined />}
            label="Redemptions"
            value={totalRedemptions}
            helper="Total voucher usage count"
            color="amber"
          />
        </div>

        {/* Tabs Area */}
        <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 md:px-7 pt-5 md:pt-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-slate-900 text-xl font-extrabold m-0">
                  Campaign Assets
                </h3>
                <p className="text-slate-500 text-sm m-0 mt-1">
                  View and manage all advertisement banners and vouchers.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                  Offers: {advertisement?.length || 0}
                </div>
                <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                  Vouchers: {vouchers?.length || 0}
                </div>
                <div className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
                  Redemptions: {totalRedemptions || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-6 pb-6">
            <Tabs
              defaultActiveKey="1"
              className="offer-management-tabs"
              items={[
                {
                  key: "1",
                  label: (
                    <span className="font-semibold">Advertisement Banners</span>
                  ),
                  children: (
                    <div className="pt-5">
                      {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {[1, 2, 3].map((i) => (
                            <CustomSkeleton key={i} />
                          ))}
                        </div>
                      ) : advertisement?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {advertisement.map((item) => (
                            <div
                              key={item._id}
                              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                              <OfferCard
                                item={item}
                                setAdvertisement={setAdvertisement}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16">
                          <Empty description="No advertisement banners found" />
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <span className="font-semibold">Voucher Master List</span>
                  ),
                  children: (
                    <div className="pt-5">
                      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                              <AppstoreOutlined className="text-emerald-600 text-lg" />
                            </div>
                            <div>
                              <h4 className="m-0 text-slate-800 font-bold text-lg">
                                Voucher Directory
                              </h4>
                              <p className="m-0 text-slate-500 text-sm">
                                Track voucher code, status, benefit and usage.
                              </p>
                            </div>
                          </div>

                          <div className="text-sm text-slate-500 font-medium">
                            Total Records:{" "}
                            <span className="text-slate-800 font-bold">
                              {vouchers?.length || 0}
                            </span>
                          </div>
                        </div>

                        <Table
                          columns={voucherColumns}
                          dataSource={vouchers}
                          rowKey="_id"
                          loading={loading}
                          pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                          }}
                          scroll={{ x: 1200 }}
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <AddVoucher
        isVisible={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onSuccess={fetchData}
      />

      <UpdateVoucher
        isVisible={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setEditingVoucher(null);
        }}
        onSuccess={fetchData}
        editingVoucher={editingVoucher}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .offer-management-tabs .ant-tabs-nav {
              margin-bottom: 0 !important;
            }

            .offer-management-tabs .ant-tabs-tab {
              color: #64748b !important;
              font-size: 14px !important;
              font-weight: 600 !important;
              padding: 14px 6px !important;
            }

            .offer-management-tabs .ant-tabs-tab:hover {
              color: #2563eb !important;
            }

            .offer-management-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
              color: #2563eb !important;
              font-weight: 700 !important;
            }

            .offer-management-tabs .ant-tabs-ink-bar {
              background: linear-gradient(90deg, #2563eb, #7c3aed) !important;
              height: 3px !important;
              border-radius: 99px !important;
            }

            .offer-management-tabs .ant-table {
              background: transparent !important;
            }

            .offer-management-tabs .ant-table-container {
              border-radius: 0 !important;
            }

            .offer-management-tabs .ant-table-thead > tr > th {
              background: #f8fafc !important;
              color: #475569 !important;
              border-bottom: 1px solid #e2e8f0 !important;
              font-size: 12px !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.04em !important;
            }

            .offer-management-tabs .ant-table-tbody > tr > td {
              border-bottom: 1px solid #eef2f7 !important;
              background: #ffffff !important;
            }

            .offer-management-tabs .ant-table-tbody > tr:hover > td {
              background: #f8fbff !important;
            }

            .offer-management-tabs .ant-table-cell-fix-left,
            .offer-management-tabs .ant-table-cell-fix-right {
              background: #ffffff !important;
              z-index: 10;
            }

            .offer-management-tabs .ant-pagination {
              padding: 18px 12px 6px !important;
            }

            .offer-management-tabs .ant-pagination-item {
              border-radius: 10px !important;
              border-color: #dbe2ea !important;
            }

            .offer-management-tabs .ant-pagination-item-active {
              border-color: #2563eb !important;
            }

            .offer-management-tabs .ant-pagination-item-active a {
              color: #2563eb !important;
              font-weight: 700 !important;
            }

            .offer-management-tabs .ant-empty-description {
              color: #64748b !important;
            }
          `,
        }}
      />
    </Layout>
  );
}

const StatCard = ({ icon, label, value, helper, color = "blue" }) => {
  const theme = statThemes[color] || statThemes.blue;

  return (
    <div
      className={`rounded-[24px] border bg-white shadow-sm p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${theme.border} ${theme.glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-400 mb-2">
            {label}
          </div>
          <div className="text-3xl font-black text-slate-900 leading-none">
            {value || 0}
          </div>
          <div className="text-sm text-slate-500 mt-3">{helper}</div>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${theme.iconBg} ${theme.iconText}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
