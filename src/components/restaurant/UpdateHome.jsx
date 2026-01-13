import { Checkbox } from "antd";
import React from "react";
import axiosInstance from "../../services/axios/axiosInstance";

function UpdateIsHomeMade({ isHomeMade, restaurantId, setRestaurant }) {
  async function handleOnChange() {
    if (!restaurantId) {
      alert("Invalid restaurant id.");
      return;
    }

    try {
      const { data } = await axiosInstance.put(
        `/admin/restaurant/make-homemade`,
        {
          restaurantId,
          isHomeMade: !isHomeMade,
        }
      );

      if (data.success) {
        alert("Update successful.");
        setRestaurant((prev) => {
          const updateRestaurant = prev.map((item) =>
            item._id === restaurantId ? { ...item, isHomeMade: !isHomeMade } : item
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
      <Checkbox checked={isHomeMade} onChange={handleOnChange}>
        Home made
      </Checkbox>
    </div>
  );
}

export default UpdateIsHomeMade;
