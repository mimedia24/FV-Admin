import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axios/axiosInstance";
import Layout from "../layout";
import {
  Table,
  Tag,
  Select,
  Typography,
  Card,
  Badge,
  Tooltip,
  message,
  Skeleton,
  Space,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  WalletOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function CashCollectionList() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const statusConfig = {
    Pending: { color: "warning", icon: <ClockCircleOutlined /> },
    Processing: { color: "processing", icon: <SyncOutlined spin /> },
    Completed: { color: "success", icon: <CheckCircleOutlined /> },
    Invalid: { color: "error", icon: <CloseCircleOutlined /> },
  };

  const fetchCollections = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/v2/rider/collection/list?page=${pageNumber}&limit=${limit}`,
      );
      if (data) {
        setCollections(data.result);
        setTotal(data.totalDocs || data.result.length);
      }
    } catch (err) {
      message.error("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections(page);
  }, [page]);

  const handleStatusChange = async (paymentId, newStatus) => {
    const hide = message.loading("Updating status...", 0);
    try {
      const { data } = await axiosInstance.put(
        `/v2/rider/collection/payment/update-status?paymentId=${paymentId}&status=${newStatus}`,
      );

      if (data.success) {
        setCollections((prev) =>
          prev.map((c) =>
            c._id === paymentId ? { ...c, status: newStatus } : c,
          ),
        );
        message.success("Status updated successfully");
      }
    } catch (err) {
      message.error("Error updating status");
    } finally {
      hide();
    }
  };

  const columns = [
    {
      title: "Rider Details",
      dataIndex: "riderId",
      key: "riderId",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong className="text-blue-600 uppercase text-xs">
            ID: {text}
          </Text>
          <Text type="secondary" size="small">
            <WalletOutlined /> {record.senderNumber}
          </Text>
        </Space>
      ),
    },
    {
      title: "Transaction Info",
      key: "transaction",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong className="text-gray-700">
            {record.transactionId}
          </Text>
          <Tag color="default" className="m-0 text-[10px]">
            {record.paymentMethod}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Text strong className="text-lg text-emerald-600">
          ৳{amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          icon={statusConfig[status]?.icon}
          color={statusConfig[status]?.color}
          className="rounded-full px-3 py-0.5 font-medium uppercase text-[10px]"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Timestamps",
      key: "timestamps",
      render: (_, record) => (
        <div className="flex flex-col text-[11px] text-gray-500">
          <Tooltip title="Created At">
            <span>
              <CalendarOutlined className="mr-1" />{" "}
              {new Date(record.createdAt).toLocaleString()}
            </span>
          </Tooltip>
          <Tooltip title="Updated At">
            <span className="text-gray-400 italic">
              Updated: {new Date(record.updatedAt).toLocaleTimeString()}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          onChange={(val) => handleStatusChange(record._id, val)}
          className="w-32"
          size="small"
          bordered={false}
          dropdownStyle={{ borderRadius: "8px" }}
          style={{ backgroundColor: "#f9fafb", borderRadius: "6px" }}
        >
          {Object.keys(statusConfig).map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Title level={2} className="!mb-1">
              Cash Collection
            </Title>
            <Text type="secondary">
              Review and manage rider payment submissions across Foodverse
              zones.
            </Text>
          </div>
          <div className="flex gap-3">
            <Card
              size="small"
              className="bg-blue-50 border-blue-100 min-w-[140px]"
            >
              <Text type="secondary" className="text-[11px] uppercase block">
                Total Entries
              </Text>
              <Text strong className="text-xl text-blue-700">
                {total}
              </Text>
            </Card>
          </div>
        </div>

        <Card className="shadow-sm border-gray-100 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          {loading && !collections.length ? (
            <Skeleton active paragraph={{ rows: 10 }} className="p-6" />
          ) : (
            <Table
              columns={columns}
              dataSource={collections}
              rowKey="_id"
              pagination={{
                current: page,
                pageSize: limit,
                total: total,
                onChange: (p) => setPage(p),
                showSizeChanger: false,
                position: ["bottomCenter"],
                className: "py-6",
              }}
              className="custom-table"
              scroll={{ x: 800 }}
            />
          )}
        </Card>
      </div>

      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          color: #64748b !important;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        .custom-table .ant-table-row:hover {
          background-color: #f1f5f9 !important;
        }
        .ant-table-pagination-item-active {
          border-color: #3b82f6 !important;
          background-color: #3b82f6 !important;
        }
        .ant-table-pagination-item-active a {
          color: #ffffff !important;
        }
      `}</style>
    </Layout>
  );
}
