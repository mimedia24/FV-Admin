import { Select } from "antd";
import { apiAuthToken, apiPath } from "../../secrets";
import { toast } from "react-toastify";
export default function ChangeRestaurantStatus({
  restaurant,
  status,
  setStatus,
}) {
  const handleChange = async (value) => {
    const body = {
      status: value,
    };
    const apiResponse = await fetch(
      `${apiPath}/admin/update-restaurant-current-status?id=${restaurant?._id}`,
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
      toast("update restaurant status successful.");
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
          value: "Not Approved",
          label: "Not Approved",
        },
        {
          value: "Waiting For Approved",
          label: "Waiting For Approved",
        },
        {
          value: "Banned",
          label: "Banned",
        },
        {
          value: "Closed",
          label: "Closed",
        },
      ]}
    />
  );
}
