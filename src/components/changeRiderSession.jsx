import React from "react";
import { Select } from "antd";
import { apiAuthToken, apiPath } from "../../secrets";
import { toast } from "react-toastify";
export default function ChangeRiderSession({ rider, session, setSession }) {
  const handleChange = async (value) => {
    const body = {
      session: value,
    };

    const apiResponse = await fetch(
      `${apiPath}/admin/update-rider-session?id=${rider._id}`,
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
      setSession(result?.session);
      toast("update order status successful.");
    }else {
      toast("failed to update status.");
    }
  };

  return (
    <Select
      className="mr-4"
      defaultValue={session}
      style={{
        width: "40%",
      }}
      onChange={handleChange}
      options={[
        {
          value: "Available",
          label: "Available",
        },
        {
          value: "Out for delivery",
          label: "Out for delivery",
        },
        {
          value: "Break",
          label: "Break",
        },
        {
          value: "Offline",
          label: "Offline",
        },
      ]}
    />
  );
}
