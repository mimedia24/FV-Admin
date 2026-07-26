import { useState } from "react";
import { Checkbox, message, Spin } from "antd";
import axiosInstance from "../../services/axios/axiosInstance";

const PopularToggle = ({ restaurantId, initialStatus }) => {
  const [isPopular, setIsPopular] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    const newStatus = e.target.checked;
    setLoading(true);

    try {
      const { data } = await axiosInstance.put(
        "/admin/make-popular-restaurant",
        {
          restaurantId,
          status: newStatus,
        }
      );

      if (data.success) {
        setIsPopular(newStatus);
        message.success(newStatus ? "Restaurant is now Popular" : "Removed from Popular");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-100 shadow-sm mt-2">
      <span className="text-xs font-bold text-gray-500 uppercase">Popular:</span>
      <Spin spinning={loading} size="small">
        <Checkbox checked={isPopular} onChange={handleToggle} />
      </Spin>
    </div>
  );
};

export default PopularToggle;
