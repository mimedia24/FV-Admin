import { Select } from "antd";
import React, { useState } from "react";
import handleApiRequest from "../../helpers/handleApiRequest";
import toast from "react-hot-toast";

export default function ChangeUserStatus({ detail, status, setStatus }) {
  const handleChange = async (value) => {
    console.log(`selected ${value}`);
    const { result, loading } = await handleApiRequest(
      `/admin/user/change-status?id=${detail._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          status: value,
        }),
      }
    );
    toast(result?.message, { duration: 2000 });
    setStatus(result?.status);
  };
  return (
    <div>
      <Select
        defaultValue={status}
        style={{
          width: 120,
        }}
        onChange={handleChange}
        options={[
          {
            value: "active",
            label: "active",
          },
          {
            value: "banned",
            label: "banned",
          },
        ]}
      />
    </div>
  );
}
