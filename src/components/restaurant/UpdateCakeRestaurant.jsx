import { Checkbox } from "antd";
import React from "react";
import axiosInstance from "../../services/axios/axiosInstance";

function UpdateCakeRestaurant({ isCake, restaurantId, setRestaurant }) {
  async function handleOnChange() {
    if (!restaurantId) {
      alert("Invalid restaurant id.");
      return;
    }

    try {
      const { data } = await axiosInstance.put(
        `/admin/update-restaurant-cake`,
        {
          restaurantId,
          isCake: !isCake,
        }
      );

      if (data.success) {
        alert("Update successful.");
        setRestaurant((prev) => {
          const updateRestaurant = prev.map((item) =>
            item._id === restaurantId ? { ...item, isCake: !isCake } : item
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
      <Checkbox checked={isCake} onChange={handleOnChange}>
        Cake
      </Checkbox>
    </div>
  );
}

export default UpdateCakeRestaurant;
