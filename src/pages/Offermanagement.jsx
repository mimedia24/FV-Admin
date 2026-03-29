import React, { useEffect, useState } from "react";
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
} from "@ant-design/icons";
import Layout from "./layout";
import axios from "axios";
import { apiAuthToken, apiPath, IMAGE_PATH } from "../../secrets";
import OfferCard from "../components/offer/OfferCard";
import CustomSkeleton from "../components/skeleton";
import AddOfferModal from "../components/offer/AddOfferModal";
import AddVoucher from "../components/offer/AddVoucher";
import axiosInstance from "../services/axios/axiosInstance";
import UpdateVoucher from "../components/offer/UpdateVoucher";

const { Title, Text } = Typography;

export default function Offermanagement() {
  const [advertisement, setAdvertisement] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // মডাল কন্ট্রোল স্টেট
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const offerRes = await axios.get(`${apiPath}/offer/all-offer`, {
        headers: { "x-auth-token": apiAuthToken },
      });
      if (offerRes.data.success) setAdvertisement(offerRes.data.response.offer);

      const voucherRes = await axiosInstance.get(`/v3/master-admin/voucher`);
      if (voucherRes.data.success) {
        setVouchers(voucherRes.data.result.data || []);
      }
    } catch (error) {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // এডিট বাটন হ্যান্ডলার
  const handleEditVoucher = (record) => {
    setEditingVoucher(record);
    setIsUpdateModalOpen(true); // Update Modal ওপেন হবে
  };

  // ডিলিট হ্যান্ডলার
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
      width: 100,
      render: (_, record) => (
        <Image
          width={50}
          height={50}
          className="rounded-lg object-cover border border-gray-800"
          src={record.image ? `${IMAGE_PATH}${record.image}` : null}
          fallback="https://via.placeholder.com/50?text=No+Img"
          preview={{ mask: <EyeOutlined className="text-white" /> }}
        />
      ),
    },
    {
      title: "Voucher Info",
      key: "info",
      fixed: "left",
      width: 180,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Tag color="gold" className="font-bold uppercase w-fit m-0">
            {record.code}
          </Tag>
          <Text className="text-[11px] text-gray-500">ID: {record._id.slice(-6)}</Text>
          <div className="flex gap-1 flex-wrap">
            {record.autoApply && <Tag color="blue" className="text-[9px] m-0 px-1">Auto</Tag>}
            {record.firsOrderOnly && <Tag color="purple" className="text-[9px] m-0 px-1">1st Order</Tag>}
          </div>
        </div>
      ),
    },
    {
      title: "Benefit",
      key: "value",
      render: (_, record) => (
        <div className="flex flex-col">
          <Text className="text-emerald-400 font-bold text-base">
            {record.type === "PERCENTAGE" ? `${record.value}% OFF` : `$${record.value} Fixed`}
          </Text>
          <Text className="text-gray-500 text-[11px]">Min: ${record.minCartAmount}</Text>
        </div>
      ),
    },
    {
      title: "Usage Status",
      key: "usage",
      width: 150,
      render: (_, record) => {
        const consumed = record.usedCount || 0;
        const total = record.usageLimit || 1;
        const percentage = Math.min(Math.round((consumed / total) * 100), 100);
        return (
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-1">
              <Text className="text-gray-400 text-[11px]">{consumed}/{total}</Text>
              <Text className="text-amber-500 text-[11px] font-bold">{percentage}%</Text>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) => (
        <Badge
          status={active ? "success" : "error"}
          text={<span style={{ color: active ? "#10b981" : "#ef4444", fontSize: "12px" }}>{active ? "Active" : "Disabled"}</span>}
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
              className="text-blue-400 hover:text-blue-300"
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

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-gray-900/40 p-8 rounded-3xl border border-gray-800 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
              <NotificationOutlined className="text-amber-500 text-3xl" />
            </div>
            <div>
              <Title level={2} style={{ margin: 0, color: "#fff", fontWeight: 800 }}>Campaign Management</Title>
              <Text className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Voucher & Banner Dashboard</Text>
            </div>
          </div>

          <Space size="middle">
            <Button icon={<ReloadOutlined />} onClick={fetchData} className="bg-gray-800 border-gray-700 text-gray-400 rounded-xl" />
            <Button
              type="primary"
              size="large"
              icon={<GiftOutlined />}
              className="bg-emerald-600 border-none h-12 px-6 rounded-xl font-bold shadow-lg"
              onClick={() => {
                setEditingVoucher(null);
                setIsVoucherModalOpen(true);
              }}
            >
              Create Voucher
            </Button>
            <AddOfferModal onSuccess={fetchData} />
          </Space>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<TagOutlined />} label="Live Offers" value={advertisement?.length} color="blue" />
          <StatCard icon={<GiftOutlined />} label="Total Vouchers" value={vouchers?.length} color="emerald" />
          <StatCard icon={<UserOutlined />} label="Redemptions" value={vouchers.reduce((acc, curr) => acc + (curr.usedCount || 0), 0)} color="amber" />
        </div>

        <Tabs
          defaultActiveKey="1"
          className="custom-tabs"
          items={[
            {
              key: "1",
              label: "Advertisement Banners",
              children: (
                <div className="mt-4">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1, 2, 3].map((i) => <CustomSkeleton key={i} />)}
                    </div>
                  ) : advertisement?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {advertisement.map((item) => <OfferCard key={item._id} item={item} setAdvertisement={setAdvertisement} />)}
                    </div>
                  ) : <Empty className="py-20" />}
                </div>
              ),
            },
            {
              key: "2",
              label: "Voucher Master List",
              children: (
                <div className="mt-4 bg-gray-900/20 p-2 md:p-6 rounded-3xl border border-gray-800">
                  <Table
                    columns={voucherColumns}
                    dataSource={vouchers}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    scroll={{ x: 1200 }}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* CREATE VOUCHER MODAL */}
      <AddVoucher
        isVisible={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* UPDATE VOUCHER MODAL */}
      <UpdateVoucher
        isVisible={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setEditingVoucher(null);
        }}
        onSuccess={fetchData}
        editingVoucher={editingVoucher}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .ant-typography { color: white !important; }
        .ant-tabs-tab { color: #6b7280 !important; font-size: 15px !important; font-weight: 600 !important; }
        .ant-tabs-tab-active .ant-tabs-tab-btn { color: #f59e0b !important; }
        .ant-tabs-ink-bar { background: #f59e0b !important; height: 3px !important; }
        .ant-table { background: transparent !important; }
        .ant-table-thead > tr > th { background: #111827 !important; color: #6b7280 !important; border-bottom: 1px solid #374151 !important; font-size: 12px; }
        .ant-table-tbody > tr > td { border-bottom: 1px solid #1f2937 !important; }
        .ant-table-tbody > tr:hover > td { background: rgba(255, 255, 255, 0.02) !important; }
        .ant-table-cell-fix-left, .ant-table-cell-fix-right { background: #0c111d !important; z-index: 10; }
        .ant-pagination-item { background: transparent !important; border-color: #374151 !important; }
        .ant-pagination-item-active { border-color: #f59e0b !important; }
      `}} />
    </Layout>
  );
}

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-gray-900/40 p-6 rounded-3xl border border-gray-800 flex items-center gap-5">
    <div className={`text-3xl text-${color}-500 bg-${color}-500/10 p-4 rounded-2xl`}>{icon}</div>
    <div>
      <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</div>
      <div className="text-3xl font-black text-white mt-1">{value || 0}</div>
    </div>
  </div>
);