import React, { useState } from "react";
import { InputNumber, message, Spin } from "antd";
import { apiAuthToken, apiPath } from "../../../secrets";
import axiosInstance from "../../services/axios/axiosInstance";

const UpdateRestaurantPosition = ({
  restaurantId,
  currentPosition,
  onUpdateSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePositionChange = async (value) => {
    if (value === currentPosition || value === null) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.put(
        `${apiPath}/admin/update-restaurant-position`,
        {
          restaurantId,
          newPosition: value,
        },
        {
          headers: { "x-auth-token": apiAuthToken },
        }
      );

      if (data.success) {
        message.success("Restaurant position updated");
        if (onUpdateSuccess) onUpdateSuccess();
      }
    } catch (err) {

        console.log(err)
      message.error(err.response?.data?.message || "Failed to update position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100">
      <span className="text-xs font-semibold text-gray-500 uppercase">
        Rank:
      </span>
      <Spin spinning={loading} size="small">
        <InputNumber
          min={1}
          size="small"
          defaultValue={currentPosition}
          onBlur={(e) => handlePositionChange(Number(e.target.value))}
          onPressEnter={(e) => handlePositionChange(Number(e.target.value))}
          className="w-16"
        />
      </Spin>
    </div>
  );
};

export default UpdateRestaurantPosition;
