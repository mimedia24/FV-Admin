import { Card } from "antd";
import React, { useState } from "react";
import ChangeRestaurantStatus from "./changeRestaurantStatus";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";

export default function RestaurantCard({
  restaurant,
  setRestaurant,
  restaurantList,
}) {
  const [status, setStatus] = useState(restaurant?.status);

  // UPDATE RESTAURANT AFTER DELETE
  function updateRestaurants(id) {
    const filterItem = restaurantList.filter((item) => item._id !== id);
    setRestaurant(filterItem);
  }

  async function handleDeleteRestaurant(id) {
    try {
      if (!id) return;
      const alertPrompt = confirm(`are you sure to delete this restaurant?`);
      if (!alertPrompt) return;
      const { data } = await axios.delete(
        `${apiPath}/admin/restaurant/delete/${id}`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (data.success) {
        updateRestaurants(id);
      }
    } catch (error) {
      console.log("delete restaurant error : ", error);
    }
  }

  return (
    <Card className="w-[500px]">
      <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-gray-100">
        <img
          src={restaurant?.image}
          alt=""
          className="object-cover w-full h-full rounded-full"
        />
      </div>

      {/* DELETE RESTAURANT BY ADMIN    */}
      <MdDelete
        className="absolute top-2 right-2 text-xl text-red-500"
        onClick={() => handleDeleteRestaurant(restaurant._id)}
      />

      <p>
        Restaurant ID: <span>{restaurant._id}</span>
      </p>
      <p>
        Status:{" "}
        <span
          className={
            status
              ? "bg-blue-500 text-white min-w-16 px-4 py-1 rounded-md"
              : "bg-gray-500 min-w-16 text-white px-4 py-1 rounded-md"
          }
        >
          {status}
        </span>
      </p>
      <p>
        Name: <span>{restaurant.name}</span>
      </p>
      <p>
        Phone: <span>{restaurant.phone}</span>
      </p>
      <p>
        Description: <span>{restaurant.description}</span>
      </p>
      <p>
        Owner name ID: <span>{restaurant.owner}</span>
      </p>
      <p>
        Address: <span>{restaurant.address}</span>
      </p>

      <div>
        <ChangeRestaurantStatus
          restaurant={restaurant}
          status={status}
          setStatus={setStatus}
        />

        <Link
          className="px-4 py-2 rounded-sm text-white bg-blue-500"
          to={`/restaurant/menu-list/${restaurant._id}`}
        >
          View menu
        </Link>
      </div>
    </Card>
  );
}
