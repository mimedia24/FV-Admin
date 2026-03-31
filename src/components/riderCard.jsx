import { Card, Tag, Divider, Button, Popconfirm, message } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  DollarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ChangeRiderStatus from "./changeRiderStatus";
import ChangeRiderSession from "./changeRiderSession";
import { IMAGE_PATH } from "../../secrets";
import { useState } from "react";
import axios from "axios"; // Assuming you use axios for API calls
import axiosInstance from "../services/axios/axiosInstance";

export default function RiderCard({ order: rider, refreshData }) {
  const [status, setStatus] = useState(rider?.riderStatus);
  const [session, setSession] = useState(rider?.session);
  const [loading, setLoading] = useState(false);

  const statusColor = {
    Active: "blue",
    Offline: "orange",
    Busy: "gray",
    Banned: "red",
    "Waiting for Approved": "geekblue",
  };

  const sessionColor = {
    available: "blue",
    offline: "orange",
    break: "purple",
    "out For Delivery": "cyan",
  };

  const handleDelete = async (riderId) => {
    setLoading(true);

    if (!riderId) {
      message.error("Invalid rider id. Please add rider id.");
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.delete(
        `/v3/master-admin/rider/delete/${riderId}`,
      );
      if (response.data.success) {
        message.success(response.data.message);
        if (refreshData) refreshData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{ width: 450 }}
      className="shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
      bodyStyle={{ padding: "1.5rem" }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow">
            <img
              src={`${IMAGE_PATH}${rider?.profileImage}`}
              alt={rider?.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {rider?.name}
            </h2>
            <p className="text-gray-500 text-sm">Rider ID: {rider?._id}</p>
          </div>
        </div>

        {/* Delete Action */}
        <Popconfirm
          title="Delete Rider Account"
          description="Are you sure you want to delete this rider? This action cannot be undone."
          onConfirm={() => handleDelete(rider?._id?.toString())}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true, loading: loading }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            className="hover:bg-red-50 rounded-full"
          />
        </Popconfirm>
      </div>

      <Divider />

      <div className="mb-3">
        <p className="font-medium text-gray-700 mb-1">Rider Status:</p>
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      </div>

      <div className="mb-3">
        <p className="font-medium text-gray-700 mb-1">Current Session:</p>
        <Tag color={sessionColor[session] || "default"}>{session}</Tag>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <PhoneOutlined className="mr-2 text-blue-500" /> {rider.phoneNumber}
        </p>
        <p>
          <MailOutlined className="mr-2 text-green-500" /> {rider.email}
        </p>
        <p>
          <HomeOutlined className="mr-2 text-purple-500" /> {rider.address}
        </p>
      </div>

      <Divider />

      <div className="flex justify-between text-gray-800 font-medium mb-4">
        <span>
          <DollarOutlined className="mr-1 text-yellow-500" /> Earning: BDT{" "}
          {rider?.earning?.toFixed() || 0}
        </span>
        <span>Cash: BDT {rider?.cashCollection?.toFixed() || 0}</span>
      </div>

      <div className="flex justify-between gap-2">
        <ChangeRiderStatus
          rider={rider}
          status={status}
          setStatus={setStatus}
        />
        <ChangeRiderSession
          rider={rider}
          session={session}
          setSession={setSession}
        />
      </div>
    </Card>
  );
}
