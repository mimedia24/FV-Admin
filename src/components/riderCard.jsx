import { Card } from "antd";
import ChangeStatus from "./changeStatus";
import { useEffect, useState } from "react";
import ChangeRiderStatus from "./changeRiderStatus";
import ChangeRiderSession from "./changeRiderSession";
export default function RiderCard({ order: rider }) {
  const [status, setStatus] = useState(rider?.riderStatus);
  const [session, setSession] = useState(rider?.session);

  return (
    <Card style={{ width: 450 }}>
      <div className="absolute top-4 right-8 w-24 h-24 object-cover rounded-full bg-gray-100">
        <img
          src={rider?.profileImage}
          alt=""
          className="object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-full w-full border-2"
        />
      </div>
      <p>Rider ID: {rider?._id}</p>
      <p>
        Rider Status:{" "}
        <span
          className={
            status === "Active"
              ? "px-2 py-1 bg-blue-400 text-white rounded-sm"
              : status === "Offline"
              ? "px-2 py-1 bg-orange-400 text-white rounded-sm"
              : status === "Busy"
              ? "px-2 py-1 bg-gray-400 text-white rounded-sm"
              : status === "Banned"
              ? "px-2 py-1 bg-red-600 text-white rounded-sm"
              : status === "Waiting for Approved"
              ? "px-2 py-1 bg-sky-600 text-white rounded-sm"
              : null
          }
        >
          {status}
        </span>
      </p>

      <p className="mt-2">
        Current Session:{" "}
        <span
          className={
            session === "available"
              ? "px-2 py-1 bg-blue-400 text-white rounded-sm"
              : session === "offline"
              ? "px-2 py-1 bg-orange-400 text-white rounded-sm"
              : session === "break"
              ? "px-2 py-1 bg-gray-400 text-white rounded-sm"
              : session === "offline"
              ? "px-2 py-1 bg-red-600 text-white rounded-sm"
              : session === "out For Delivery"
              ? "px-2 py-1 bg-sky-600 text-white rounded-sm"
              : null
          }
        >
          {session}
        </span>
      </p>

      <p>
        Full Name: <span>{rider.name}</span>
      </p>
      <p>
        Phone Number: <span>{rider.phoneNumber}</span>
      </p>
      <p>
        Email: <span>{rider.email}</span>
      </p>
      <p>
        Address: <span>{rider.address}</span>
      </p>

      <p>
        Wallet ID: <span>{rider.walletId._id}</span>
      </p>
      <p>
        Wallet Balance <span>BDT {rider.walletId.walletBalance}</span>
      </p>

      <div>
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
