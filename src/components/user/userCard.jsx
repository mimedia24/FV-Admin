import { Card } from "antd";
import React, { useState } from "react";
import ChangeUserStatus from "./changeUserStatus";

export default function UserCard({ detail }) {
  const [address, setAddress] = useState(detail.address);

  const [status, setStatus] = useState(detail?.status);
  return (
    <Card
      style={{
        width: 350,
      }}
    >
      <h1>
        ID: <span>{detail?._id}</span>
      </h1>
      <h1>
        status:
        <span
          className={
            status == "active"
              ? "px-4 py-1 text-white bg-blue-500"
              : "px-4 py-1 text-white bg-orange-500"
          }
        >
          {status}
        </span>
      </h1>
      <h1>
        Name: <span>{detail.fullName}</span>
      </h1>
      <h1>
        Email: <span>{detail.email}</span>
      </h1>
      <h1>
        Phone: <span>{detail.phoneNumber}</span>
      </h1>
      <h1>Addresses</h1>
      <div>
        <h1>
          Home: <span>{address?.home?.address}</span>
        </h1>
        <h1>
          Office: <span>{address?.home?.office}</span>
        </h1>
        <h1>
          Others: <span>{address?.home?.others}</span>
        </h1>
      </div>

      <div>
        <ChangeUserStatus
          detail={detail}
          status={status}
          setStatus={setStatus}
        />
      </div>
    </Card>
  );
}
