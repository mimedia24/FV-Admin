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
} from "antd";
import {
  PlusOutlined,
  GlobalOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Layout from "./layout";
import AddZoneForm from "../components/zone/AddZoneForm";
import axiosInstance from "../services/axios/axiosInstance";
import UpdateZoneForm from "../components/zone/UpdateZoneForm";
import UpdateZoneResource from "../components/zone/UpdateZoneResource";

const { Title, Text } = Typography;

function ZoneManagementScreen() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false); // New state for Resource Modal
  const [selectedZone, setSelectedZone] = useState(null);

  // --- API Actions ---

  const fetchZones = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/v3/master-admin/zone/list");
      setZones(response.data.result.data || []);
    } catch (error) {
      message.error("Failed to load zone list");
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

  useEffect(() => {
    fetchZones();
  }, []);

  // --- Table Configuration ---

  const columns = [
    {
      title: "Zone ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Text className="text-blue-500 font-mono">#{id}</Text>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Space>
          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
            <EnvironmentOutlined className="text-blue-500" />
          </div>
          <Text className="text-white font-medium">{name}</Text>
        </Space>
      ),
    },
    {
      title: "Vertices",
      dataIndex: "polygon",
      key: "polygon",
      render: (poly) => (
        <Tag className="bg-gray-800 border-gray-700 text-gray-400">
          {poly?.length || 0} Points
        </Tag>
      ),
    },
    {
      title: "Visibility",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) => (
        <Tag
          color={active ? "blue" : "default"}
          className="rounded-full border-none px-3 uppercase text-[10px]"
        >
          {active ? "Online" : "Offline"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          {/* Update Resource Button */}
          <Tooltip title="Update Resource">
            <Button
              type="text"
              className="text-gray-400 hover:text-amber-500"
              icon={<SettingOutlined />}
              onClick={() => {
                setSelectedZone(record);
                setIsResourceModalOpen(true); // Open Resource Modal
              }}
            />
          </Tooltip>

          {/* Edit Geometry Button */}
          <Tooltip title="Edit Geometry">
            <Button
              type="text"
              className="text-gray-400 hover:text-blue-500"
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div>
          <Space align="center">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <GlobalOutlined className="text-blue-500 text-2xl" />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: "#fff" }}>
                Geofencing
              </Title>
              <Text className="text-gray-500 text-xs uppercase tracking-widest font-bold">
                Operational Service Zones
              </Text>
            </div>
          </Space>
        </div>

        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchZones}
            className="bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
          />
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 border-none h-12 px-8 rounded-xl font-bold shadow-lg shadow-blue-500/20"
          >
            Create New Zone
          </Button>
        </Space>
      </div>

      <div className="bg-gray-900/40 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl backdrop-blur-sm">
        <Table
          dataSource={zones}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 7, className: "p-4" }}
          className="custom-dark-table"
        />
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

      {/* Resource Update Modal Integration */}
      <UpdateZoneResource 
        isVisible={isResourceModalOpen}
        onClose={() => {
          setIsResourceModalOpen(false);
          setSelectedZone(null);
        }}
        zoneData={selectedZone}
        onUpdateSuccess={() => {
          fetchZones(); // Refresh table after update
        }}
      />

      <style>{`
        .custom-dark-table .ant-table { background: transparent !important; color: #9ca3af !important; }
        .custom-dark-table .ant-table-thead > tr > th { background: #0e121d !important; color: #4b5563 !important; border-bottom: 1px solid #1f2937 !important; font-size: 10px; text-transform: uppercase; font-weight: 800; }
        .custom-dark-table .ant-table-tbody > tr > td { border-bottom: 1px solid #1f2937 !important; padding: 16px !important; }
        .custom-dark-table .ant-table-tbody > tr:hover > td { background: rgba(59, 130, 246, 0.03) !important; }
        .ant-popover-inner { background-color: #111827 !important; border: 1px solid #374151 !important; color: white !important; }
        .ant-popconfirm-title, .ant-popconfirm-description { color: white !important; }
      `}</style>
    </Layout>
  );
}

export default ZoneManagementScreen;