import { Select } from "antd";
import useFetch from "../useFetch/useFetch";
import { apiAuthToken, apiPath } from "../../secrets";
import { toast } from "react-toastify";
import { useState } from "react";

export default function ChangeStatus({ order, status, setStatus }) {
  const handleChange = async (value) => {
    
    const body = {
      status: value,
    };

    const apiResponse = await fetch(
      `${apiPath}/admin/change-order-status?id=${order._id}`,
      {
        method: "POST",
        
        headers: {
          "x-auth-token": apiAuthToken,
          "Content-Type": "application/json",
          
        },
        
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    const result = await apiResponse.json();

    if (result?.success) {
      setStatus(result?.status);
      toast("update order status successful.");
    }
  };

  return (
    <Select
      className="mr-4"
      defaultValue={status}
      style={{
        width: "100px",
        margin: "0 auto"
      }}
      onChange={handleChange}
      options={[
        {
          value: "pending",
          label: "pending",
        },
        {
          value: "accept by rider",
          label: "accept by rider",
        },
        {
          value: "accept by restaurant",
          label: "accept by restaurant",
        },
        {
          value: "ready for pickup",
          label: "ready for pickup",
        },
        {
          value: "picked up",
          label: "picked up",
        },
        {
          value: "cancelled by restaurant",
          label: "cancelled by restaurant",
        },
        {
          value: "cancelled",
          label: "cancelled",
        },
        {
          value: "delivered",
          label: "delivered",
        },
      ]}
    />
  );
}
