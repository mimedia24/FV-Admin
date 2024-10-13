import React from "react";
import { Select } from "antd";
import { apiAuthToken, apiPath } from "../../secrets";
import { toast } from "react-toastify";
export default function ChangeRiderStatus({ rider, status, setStatus }) {
  const handleChange = async (value) => {
    const body = {
      status: value,
    };

    const apiResponse = await fetch(
      `${apiPath}/admin/update-rider-status?id=${rider._id}`,
      {
        method: "PUT",

        headers: {
          "x-auth-token": apiAuthToken,
          "Content-Type": "application/json",
        },

        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    const result = await apiResponse.json();

    console.log(result);

    if (result?.success) {
      setStatus(result?.status);
      toast(result?.message);
    }
  };

  return (
    <Select
      className="mr-4"
      defaultValue={status}
      style={{
        width: "40%",
      }}
      onChange={handleChange}
      options={[
        {
          value: "Active",
          label: "Active",
        },
        {
          value: "Busy",
          label: "Busy",
        },
        {
          value: "Banned",
          label: "Banned",
        },
        {
          value: "Waiting for Approved",
          label: "Waiting for Approved",
        },
      ]}
    />
  );
}
