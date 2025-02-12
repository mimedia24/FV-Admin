import { Card } from "antd";
import React, { useState } from "react";
import ChangeUserStatus from "./changeUserStatus";

export default function UserCard({ detail, slNO }) {
  const [address, setAddress] = useState(detail.address);

  const [status, setStatus] = useState(detail?.status);
  return (
    <tr className="text-[11px]">
      <td className="border px-2 text-center">{slNO + 1}</td>
      <td className="border px-2 text-center">
        <span>{detail?._id}</span>
      </td>
      <td className="border px-2 py-1">
        <img
          src={detail.profileImage || "images/avater.png"}
          alt="profile-image"
          className="w-12 border mx-auto h-12 rounded-full"
        />
      </td>
      <td className="border px-2 text-center">
        <span
          className={
            status == "active"
              ? "px-4 py-1 min-w-[70px] inline-block text-white bg-blue-500"
              : "px-4 py-1 min-w-[70px] inline-block text-white bg-orange-500"
          }
        >
          {status}
        </span>
      </td>
      <td className="border px-2 text-center">
        <span>{detail.fullName}</span>
      </td>
      <td className="border px-2 text-center">
        <span>{detail.email}</span>
      </td>
      <td className="border px-2 text-center">
        <span>{detail.phoneNumber}</span>
      </td>
      <td className="border px-2 text-center">
        <span className="block">{address?.home?.address}</span>
        <span className="block">longitude: {address?.office?.longitude}</span>
        <span className="block">latitude: {address?.office?.latitude}</span>
      </td>

      <td className="border px-2 text-center ">
        <span className="block">{address?.office?.address}</span>
        <span className="block">longitude: {address?.office?.longitude}</span>
        <span className="block">latitude: {address?.office?.latitude}</span>
      </td>
      <td className="border px-2 text-center">
        <span className="block">{address?.others?.address}</span>
        <span className="block">longitude: {address?.others?.longitude}</span>
        <span className="block">latitude: {address?.others?.latitude}</span>
      </td>
      <td className="border px-2 text-center">
        <ChangeUserStatus
          detail={detail}
          status={status}
          setStatus={setStatus}
        />
      </td>
    </tr>
  );
}
