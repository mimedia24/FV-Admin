import { Card, Tag, Divider } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, DollarOutlined } from "@ant-design/icons";
import ChangeRiderStatus from "./changeRiderStatus";
import ChangeRiderSession from "./changeRiderSession";
import { IMAGE_PATH } from "../../secrets";
import { useState } from "react";

export default function RiderCard({ order: rider }) {
  const [status, setStatus] = useState(rider?.riderStatus);
  const [session, setSession] = useState(rider?.session);

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

  return (
    <Card
      style={{ width: 450 }}
      className="shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
      bodyStyle={{ padding: "1.5rem" }}
    >
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow">
          <img
            src={`${IMAGE_PATH}${rider?.profileImage}`}
            alt={rider?.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{rider?.name}</h2>
          <p className="text-gray-500 text-sm">Rider ID: {rider?._id}</p>
        </div>
      </div>

      <Divider />

      {/* Status */}
      <div className="mb-3">
        <p className="font-medium text-gray-700 mb-1">Rider Status:</p>
        <Tag color={statusColor[status] || "default"}>{status}</Tag>
      </div>

      {/* Session */}
      <div className="mb-3">
        <p className="font-medium text-gray-700 mb-1">Current Session:</p>
        <Tag color={sessionColor[session] || "default"}>{session}</Tag>
      </div>

      {/* Rider Info */}
      <div className="space-y-2 text-sm text-gray-600">
        <p><PhoneOutlined className="mr-2 text-blue-500" /> {rider.phoneNumber}</p>
        <p><MailOutlined className="mr-2 text-green-500" /> {rider.email}</p>
        <p><HomeOutlined className="mr-2 text-purple-500" /> {rider.address}</p>
      </div>

      <Divider />

      {/* Earnings Section */}
      <div className="flex justify-between text-gray-800 font-medium mb-4">
        <span><DollarOutlined className="mr-1 text-yellow-500" /> Earning: BDT {rider?.earning?.toFixed() || 0}</span>
        <span>Cash: BDT {rider?.cashCollection?.toFixed() || 0}</span>
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-2">
        <ChangeRiderStatus rider={rider} status={status} setStatus={setStatus} />
        <ChangeRiderSession rider={rider} session={session} setSession={setSession} />
      </div>
    </Card>
  );
}
