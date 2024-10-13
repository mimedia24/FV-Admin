import { Card } from "antd";
import ChangeStatus from "./changeStatus";
import { useEffect, useState } from "react";
import ChangeRiderStatus from "./changeRiderStatus";
import ChangeRiderSession from "./changeRiderSession";
export default function RiderCard({ order: rider }) {
  const [status, setStatus] = useState(rider?.riderStatus);
  const [session, setSession] = useState(rider?.session);

  useEffect(() => {
    console.log(rider)
  }, []);

  return (
    <Card style={{ width: 450 }}>
      <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-gray-100">
        <img
          src={rider?.profileImage}
          alt=""
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
            session === "Available"
              ? "px-2 py-1 bg-blue-400 text-white rounded-sm"
              : session === "Offline"
              ? "px-2 py-1 bg-orange-400 text-white rounded-sm"
              : session === "Break"
              ? "px-2 py-1 bg-gray-400 text-white rounded-sm"
              : session === "Offline"
              ? "px-2 py-1 bg-red-600 text-white rounded-sm"
              : session === "Out for delivery"
              ? "px-2 py-1 bg-sky-600 text-white rounded-sm"
              : null
          }
        >
          {session}
        </span>
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
