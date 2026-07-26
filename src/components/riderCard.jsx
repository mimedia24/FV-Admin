import {
  Card,
  Tag,
  Divider,
  Button,
  Popconfirm,
  message,
  Select,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  DollarOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import ChangeRiderStatus from "./changeRiderStatus";
import ChangeRiderSession from "./changeRiderSession";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../services/axios/axiosInstance";
import { resolveImageUrl, useImageFallback } from "../helpers/imageUrl";

const toNumber = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const zoneOptions = [
  {
    value: 1,
    label: "Lakshmipur Zone",
  },
  {
    value: 2,
    label: "Noakhali Zone",
  },
];

const getZoneName = (zoneId, zoneName) => {
  if (zoneName) return zoneName;
  if (Number(zoneId) === 2) return "Noakhali Zone";
  return "Lakshmipur Zone";
};

export default function RiderCard({ order: rider, refreshData }) {
  const normalizedStatus = useMemo(() => {
    return (
      rider?.riderStatus ||
      rider?.status ||
      rider?.currentStatus ||
      rider?.rider_current_status ||
      "active"
    );
  }, [rider]);

  const normalizedSession = useMemo(() => {
    return (
      rider?.session ||
      rider?.currentSession ||
      rider?.riderSession ||
      rider?.current_session ||
      "offline"
    );
  }, [rider]);

  const normalizedName = useMemo(() => {
    return rider?.name || rider?.fullName || "Unknown Rider";
  }, [rider]);

  const normalizedRiderId = useMemo(() => {
    return (
      rider?._id ||
      rider?.riderId ||
      rider?.id ||
      rider?.rider?._id ||
      "N/A"
    );
  }, [rider]);

  const normalizedEmail = useMemo(() => {
    return rider?.email || rider?.gmail || "N/A";
  }, [rider]);

  const normalizedPhone = useMemo(() => {
    return rider?.phoneNumber || rider?.phone || "N/A";
  }, [rider]);

  const normalizedAddress = useMemo(() => {
    return rider?.address || rider?.location || rider?.presentAddress || "N/A";
  }, [rider]);

  const earningAmount = useMemo(() => {
    return toNumber(
      rider?.earning ??
        rider?.totalEarning ??
        rider?.wallet ??
        rider?.balance ??
        rider?.total_income ??
        0
    );
  }, [rider]);

  const cashAmount = useMemo(() => {
    return toNumber(
      rider?.cashCollection ??
        rider?.cash ??
        rider?.cashCollected ??
        rider?.collectionAmount ??
        rider?.cash_collection ??
        0
    );
  }, [rider]);

  // IMPORTANT:
  // Order routing uses activeZoneId.
  // So UI must show activeZoneId first, then fallback to zoneId.
  const defaultZoneId = Number(rider?.activeZoneId || rider?.zoneId || 1);
  const defaultZoneName =
    rider?.activeZoneName || rider?.zoneName || getZoneName(defaultZoneId);

  const [status, setStatus] = useState(normalizedStatus);
  const [session, setSession] = useState(normalizedSession);
  const [assignedZoneId, setAssignedZoneId] = useState(defaultZoneId);
  const [assignedZoneName, setAssignedZoneName] = useState(defaultZoneName);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(normalizedStatus);
  }, [normalizedStatus]);

  useEffect(() => {
    setSession(normalizedSession);
  }, [normalizedSession]);

  useEffect(() => {
    const nextZoneId = Number(rider?.activeZoneId || rider?.zoneId || 1);
    const nextZoneName =
      rider?.activeZoneName || rider?.zoneName || getZoneName(nextZoneId);

    setAssignedZoneId(nextZoneId);
    setAssignedZoneName(nextZoneName);
  }, [
    rider?.zoneId,
    rider?.zoneName,
    rider?.activeZoneId,
    rider?.activeZoneName,
  ]);

  const statusColor = {
    active: "blue",
    Active: "blue",
    offline: "orange",
    Offline: "orange",
    busy: "gray",
    Busy: "gray",
    banned: "red",
    Banned: "red",
    "waiting for Approved": "geekblue",
    "Waiting for Approved": "geekblue",
    "waiting for approved": "geekblue",
  };

  const sessionColor = {
    available: "blue",
    Available: "blue",
    offline: "orange",
    Offline: "orange",
    break: "purple",
    Break: "purple",
    busy: "purple",
    Busy: "purple",
    "out For Delivery": "cyan",
    "out for delivery": "cyan",
    "Out for delivery": "cyan",
    "Out For Delivery": "cyan",
  };

  const handleDelete = async (riderId) => {
    setLoading(true);

    if (!riderId || riderId === "N/A") {
      message.error("Invalid rider id. Please add rider id.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/v3/master-admin/rider/delete/${riderId}`
      );

      if (response.data.success) {
        message.success(response.data.message);
        if (refreshData) refreshData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete account"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssignZone = async (zoneId) => {
    if (!normalizedRiderId || normalizedRiderId === "N/A") {
      message.error("Invalid rider id.");
      return;
    }

    try {
      setZoneLoading(true);

      const response = await axiosInstance.put(
        `/admin/rider/assign-zone?id=${normalizedRiderId}`,
        {
          zoneId: Number(zoneId),
          updatedBy: "admin",
        }
      );

      if (response.data?.success) {
        const updatedRider = response.data?.rider;

        if (!updatedRider?.activeZoneId && !updatedRider?.zoneId) {
          message.error(
            "Server response missing zone data. Backend assign-zone API must return activeZoneId."
          );
          return;
        }

        const finalZoneId = Number(
          updatedRider?.activeZoneId || updatedRider?.zoneId
        );

        const finalZoneName =
          updatedRider?.activeZoneName ||
          updatedRider?.zoneName ||
          getZoneName(finalZoneId);

        setAssignedZoneId(finalZoneId);
        setAssignedZoneName(finalZoneName);

        message.success(response.data.message || "Rider zone updated.");

        if (refreshData) {
          await refreshData();
        }
      } else {
        message.error(response.data?.message || "Failed to update rider zone.");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update rider zone."
      );
    } finally {
      setZoneLoading(false);
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
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow bg-gray-50">
            <img
              src={resolveImageUrl(rider?.profileImage)}
              alt={normalizedName}
              className="object-cover w-full h-full"
              onError={useImageFallback}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {normalizedName}
            </h2>
            <p className="text-gray-500 text-sm">
              Rider ID: {normalizedRiderId}
            </p>
          </div>
        </div>

        <Popconfirm
          title="Delete Rider Account"
          description="Are you sure you want to delete this rider? This action cannot be undone."
          onConfirm={() => handleDelete(normalizedRiderId?.toString())}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true, loading }}
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <p className="font-medium text-gray-700 mb-1">Rider Status:</p>
          <Tag color={statusColor[status] || "default"}>
            {status || "N/A"}
          </Tag>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-1">Current Session:</p>
          <Tag color={sessionColor[session] || "default"}>
            {session || "N/A"}
          </Tag>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="m-0 text-sm font-bold text-blue-700">
            <EnvironmentOutlined className="mr-1" />
            Assigned Zone
          </p>

          <Tag color={Number(assignedZoneId) === 2 ? "purple" : "blue"}>
            {assignedZoneName} #{assignedZoneId}
          </Tag>
        </div>

        <Select
          value={Number(assignedZoneId)}
          loading={zoneLoading}
          disabled={zoneLoading}
          onChange={handleAssignZone}
          options={zoneOptions}
          style={{ width: "100%" }}
          placeholder="Select rider zone"
        />
      </div>

      <Divider />

      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <PhoneOutlined className="mr-2 text-blue-500" /> {normalizedPhone}
        </p>
        <p>
          <MailOutlined className="mr-2 text-green-500" /> {normalizedEmail}
        </p>
        <p>
          <HomeOutlined className="mr-2 text-purple-500" /> {normalizedAddress}
        </p>
      </div>

      <Divider />

      <div className="flex justify-between text-gray-800 font-medium mb-4">
        <span>
          <DollarOutlined className="mr-1 text-yellow-500" /> Earning: BDT{" "}
          {Math.trunc(earningAmount)}
        </span>
        <span>Cash: BDT {Math.trunc(cashAmount)}</span>
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
