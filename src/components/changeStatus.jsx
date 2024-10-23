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
          value: "Pending",
          label: "Pending",
        },
        {
          value: "Delivered",
          label: "Delivered",
        },
        {
          value: "Accept By Rider",
          label: "Accept By Rider",
        },
        {
          value: "Ready for Pickup",
          label: "Ready for Pickup",
        },
        {
          value: "Picked Up",
          label: "Picked Up",
        },
        {
          value: "Cancelled by Restaurant",
          label: "Cancelled by Restaurant",
        },
        {
          value: "Cencelled",
          label: "Cencelled",
        },
      ]}
    />
  );
}
