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

  function updateRestaurants(id) {
    const filterItem = restaurantList.filter((item) => item._id !== id);
    setRestaurant(filterItem);
  }

  async function handleDeleteRestaurant(id) {
    try {
      if (!id) return;
      const alertPrompt = confirm(`Are you sure you want to delete this restaurant?`);
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
      console.log("Delete restaurant error:", error);
    }
  }

  return (
    <Card
      className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
      bodyStyle={{ padding: 0 }}
    >
      {/* Delete Icon */}
      <MdDelete
        className="absolute top-4 right-4 text-2xl text-red-500 cursor-pointer hover:scale-110 transition"
        onClick={() => handleDeleteRestaurant(restaurant._id)}
      />

      {/* Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-md border border-gray-300 mx-auto -mt-12 mb-4 bg-gray-100">
        <img
          src={restaurant?.image}
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 pb-4 space-y-2 text-center">
        <h2 className="text-lg font-semibold">{restaurant.name}</h2>
        <p className="text-sm text-gray-500">{restaurant.description}</p>

        <div className="flex justify-center gap-2 mt-2">
          <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
            ID: {restaurant._id}
          </span>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              status ? "bg-blue-500 text-white" : "bg-gray-400 text-white"
            }`}
          >
            {status}   
          </span>
        </div>

        <div className="text-sm text-left mt-4 space-y-1">
          <p>
            <strong>Phone:</strong> {restaurant.phone}
          </p>
          <p>
            <strong>Owner:</strong> {restaurant.owner}
          </p>
          <p>
            <strong>Address:</strong> {restaurant.address}
          </p>
          <p>
            <strong>Balance:</strong> {restaurant.balance}
          </p>
        </div>

        {/* Status control + Menu link */}
        <div className="mt-4 space-y-2">
          <ChangeRestaurantStatus
            restaurant={restaurant}
            status={status}
            setStatus={setStatus}
          />

          <Link
            className="inline-block w-full text-center py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            to={`/restaurant/menu-list/${restaurant._id}`}
          >
            View Menu
          </Link>
        </div>
      </div>
    </Card>
  );
}
