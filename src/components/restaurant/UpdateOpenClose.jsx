import { Checkbox } from "antd";
import React from "react";
import axiosInstance from "../../services/axios/axiosInstance";

function UpdateOpenClose({ isOpen, restaurantId, setRestaurant }) {
  async function handleOnChange() {
    if (!restaurantId) {
      alert("Invalid restaurant id.");
      return;
    }

    try {
      const { data } = await axiosInstance.put(
        `/restaurant/open-close?id=${restaurantId}`
      );

      if (data.success) {
        alert("Update successful.");
        setRestaurant((prev) => {
          const updateRestaurant = prev.map((item) =>
            item._id === restaurantId ? { ...item, isOpen: !isOpen } : item
          );
          return updateRestaurant;
        });
      } else {
        throw new Error("Failed to update.");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  return (
    <div>
      <Checkbox checked={isOpen} onChange={handleOnChange}>
        {isOpen ? "Open" : "Close"}
      </Checkbox>
    </div>
  );
}

export default UpdateOpenClose;
