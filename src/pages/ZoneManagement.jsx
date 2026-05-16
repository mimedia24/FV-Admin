import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
  Popconfirm,
  Empty,
} from "antd";
import {
  PlusOutlined,
  GlobalOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  BorderOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Layout from "./layout";
import AddZoneForm from "../components/zone/AddZoneForm";
import axiosInstance from "../services/axios/axiosInstance";
import UpdateZoneForm from "../components/zone/UpdateZoneForm";
import UpdateZoneResource from "../components/zone/UpdateZoneResource";

const { Title, Text } = Typography;

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

function ZoneManagementScreen() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const fetchZones = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get("/v3/master-admin/zone/list");

      const zoneList =
        response?.data?.result?.data ||
        response?.data?.data ||
        response?.data?.zones ||
        [];

      setZones(Array.isArray(zoneList) ? zoneList : []);
    } catch (error) {
      console.log("Zone list error:", error?.response?.data || error);
      message.error("Failed to load zone list");
      setZones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/v3/master-admin/zone/${id}`);
      message.success("Zone deleted successfully");
      fetchZones();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete zone");
    }
  };

  const handleToggleZoneStatus = async (record) => {
    const nextStatus = !Boolean(record?.isActive);
    const oldZones = [...zones];

    try {
      setStatusUpdatingId(record.id);

      setZones((prev) =>
        prev.map((zone) =>
          zone.id === record.id ? { ...zone, isActive: nextStatus } : zone
        )
      );

      await axiosInstance.put(`/v3/master-admin/zone/status/${record.id}`, {
        isActive: nextStatus,
      });

      message.success(
        nextStatus
          ? `${record.name} is now online`
          : `${record.name} is now offline`
      );

      await fetchZones();
    } catch (error) {
      console.log("Zone status update error:", error?.response?.data || error);

      setZones(oldZones);

      message.error(
        error.response?.data?.message || "Failed to update zone status"
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const totalZones = zones.length;
  const activeZones = zones.filter((zone) => zone?.isActive).length;
  const totalVertices = zones.reduce(
    (sum, zone) => sum + (zone?.polygon?.length || 0),
    0
  );

  const columns = [
    {
      title: "Zone ID",
      dataIndex: "id",
      key: "id",
      width: 110,
      render: (id) => (
        <Text className="font-mono font-semibold text-blue-600">#{id}</Text>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 260,
      render: (name) => (
        <Space size="middle">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <EnvironmentOutlined />
          </div>

          <div className="flex flex-col">
            <Text className="font-semibold text-slate-800">{name}</Text>
            <Text className="text-xs text-slate-400">
              Operational service zone
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Vertices",
      dataIndex: "polygon",
      key: "polygon",
      width: 170,
      render: (poly) => (
        <Tag className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
          {(poly?.length || 0).toLocaleString("en-BD")} Points
        </Tag>
      ),
    },
    {
      title: "Visibility",
      dataIndex: "isActive",
      key: "isActive",
      width: 230,
      render: (active, record) => (
        <Space>
          <Tag
            color={active ? "blue" : "default"}
            className="rounded-full border-none px-3 py-1 uppercase text-[10px] font-bold"
          >
            {active ? "Online" : "Offline"}
          </Tag>

          <Button
            size="small"
            type={active ? "default" : "primary"}
            loading={statusUpdatingId === record.id}
            onClick={() => handleToggleZoneStatus(record)}
            className="!rounded-lg !font-semibold"
          >
            {active ? "Make Offline" : "Make Online"}
          </Button>
        </Space>
      ),
    },
    {
      title: "Actions",
      align: "right",
      key: "actions",
      width: 170,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Update Resource">
            <Button
              type="text"
              className="!text-slate-400 hover:!text-amber-500"
              icon={<SettingOutlined />}
              onClick={() => {
                setSelectedZone(record);
                setIsResourceModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Edit Geometry">
            <Button
              type="text"
              className="!text-slate-400 hover:!text-blue-500"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedZone(record);
                setIsUpdateModalOpen(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Delete this zone?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Remove Zone">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-[1450px] px-4 py-6 md:px-6 md:py-8">
        <div className="relative mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200/50">
                <GlobalOutlined className="text-[28px]" />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-500">
                  <ThunderboltOutlined />
                  Operational Service Zones
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
                  Geofencing Management
                </Title>

                <Text className="text-slate-500 text-sm md:text-base">
                  Manage service areas, geometry updates and zone resources from
                  one clean interface.
                </Text>
              </div>
            </div>

            <Space wrap size="middle">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchZones}
                className="!h-11 !rounded-xl !border-slate-200 !text-slate-600 !font-semibold"
              >
                Refresh
              </Button>

              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalOpen(true)}
                className="!h-11 !rounded-xl !px-6 !font-bold !border-none !bg-gradient-to-r !from-blue-600 !to-cyan-500 hover:!from-blue-700 hover:!to-cyan-600 shadow-md"
              >
                Create New Zone
              </Button>
            </Space>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<GlobalOutlined />}
            label="Total Zones"
            value={totalZones}
            helper="All configured service zones"
            color="blue"
          />

          <StatCard
            icon={<EyeOutlined />}
            label="Active Zones"
            value={activeZones}
            helper="Currently visible operational areas"
            color="emerald"
          />

          <StatCard
            icon={<BorderOutlined />}
            label="Total Vertices"
            value={totalVertices}
            helper="Combined geometry points"
            color="amber"
          />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4 md:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="m-0 text-xl font-extrabold text-slate-900">
                  Zone Directory
                </h3>

                <p className="m-0 mt-1 text-sm text-slate-500">
                  Review all zone ids, geometry points, status and controls.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                  Zones: {totalZones}
                </div>

                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                  Active: {activeZones}
                </div>

                <div className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                  Vertices: {totalVertices}
                </div>
              </div>
            </div>
          </div>

          <div className="px-2 pb-4 md:px-4 md:pb-6">
            <Table
              dataSource={zones}
              columns={columns}
              loading={loading}
              rowKey={(record) => record?._id || record?.id}
              pagination={{
                pageSize: 7,
                className: "p-4",
              }}
              locale={{
                emptyText: (
                  <div className="py-14">
                    <Empty description="No zone found" />
                  </div>
                ),
              }}
              className="zone-light-table"
            />
          </div>
        </div>
      </div>

      <AddZoneForm
        visible={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchZones();
        }}
      />

      <UpdateZoneForm
        visible={isUpdateModalOpen}
        zoneData={selectedZone}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setSelectedZone(null);
        }}
        onSuccess={() => {
          setIsUpdateModalOpen(false);
          fetchZones();
        }}
      />

      <UpdateZoneResource
        isVisible={isResourceModalOpen}
        onClose={() => {
          setIsResourceModalOpen(false);
          setSelectedZone(null);
        }}
        zoneData={selectedZone}
        onUpdateSuccess={() => {
          fetchZones();
        }}
      />

      <style>{`
        .zone-light-table .ant-table {
          background: transparent !important;
        }

        .zone-light-table .ant-table-thead > tr > th {
          background: #f8fafc !important;
          color: #475569 !important;
          border-bottom: 1px solid #e2e8f0 !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          font-weight: 800 !important;
          letter-spacing: 0.04em !important;
        }

        .zone-light-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #eef2f7 !important;
          padding: 16px !important;
          background: #ffffff !important;
        }

        .zone-light-table .ant-table-tbody > tr:hover > td {
          background: #f8fbff !important;
        }

        .zone-light-table .ant-pagination-item {
          border-radius: 10px !important;
          border-color: #dbe2ea !important;
        }

        .zone-light-table .ant-pagination-item-active {
          border-color: #2563eb !important;
        }

        .zone-light-table .ant-pagination-item-active a {
          color: #2563eb !important;
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

export default ZoneManagementScreen;