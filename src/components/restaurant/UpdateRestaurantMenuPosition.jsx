import React, { useState } from "react";
import { InputNumber, message, Spin } from "antd";
import axiosInstance from "../../services/axios/axiosInstance";

const PositionUpdate = ({ menuId, currentPosition, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePositionChange = async (value) => {
    if (value === currentPosition || value === null) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.put("/admin/update-menu-position", {
        menuId,
        newPosition: value,
      });

      if (data.success) {
        message.success("Position rearranged successfully");
        if (onUpdateSuccess) onUpdateSuccess(); 
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Spin spinning={loading} size="small">
        <InputNumber
          min={1}
          defaultValue={currentPosition}
          onBlur={(e) => handlePositionChange(Number(e.target.value))}
          onPressEnter={(e) => handlePositionChange(Number(e.target.value))}
          className="w-20"
        />
      </Spin>
    </div>
  );
};

export default PositionUpdate;
