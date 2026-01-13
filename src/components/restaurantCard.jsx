import React, { useState } from "react";
import { Card, Tag, Popconfirm, Button } from "antd";
import { Link } from "react-router-dom";
import {
  MdDelete,
  MdLocationOn,
  MdPhone,
  MdPerson,
  MdAttachMoney,
} from "react-icons/md";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import ChangeRestaurantStatus from "./changeRestaurantStatus";
import UpdateCakeRestaurant from "./restaurant/UpdateCakeRestaurant";
import UpdateIsHomeMade from "./restaurant/UpdateHome";

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
      console.error("Delete restaurant error:", error);
    }
  }

  return (
    <Card
      className="relative w-full max-w-xs bg-white rounded-xl shadow-lg border border-gray-200"
      bodyStyle={{ padding: 0 }}
    >
      {/* Top Section */}
      <div className="p-4 flex items-center justify-between">
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-white bg-gray-100">
          <img
            src={import.meta.env.VITE_IMAGE_PATH + restaurant.image}
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-right">
          <Popconfirm
            title="Delete this restaurant?"
            description="Are you sure you want to delete this restaurant?"
            onConfirm={() => handleDeleteRestaurant(restaurant._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<MdDelete className="text-red-500" size={24} />}
              className="p-0 border-none hover:bg-gray-100"
            />
          </Popconfirm>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="px-4 pb-4 space-y-3">
        <div className="text-center">
          <h2 className="text-base font-bold truncate">{restaurant.name}</h2>
          <p className="text-xs text-gray-500 truncate">
            {restaurant.description}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          <Tag color="blue" className="text-xs">
            ID: {restaurant._id.slice(0, 8)}...
          </Tag>
          <Tag color={status ? "green" : "red"} className="text-xs">
            {status}
          </Tag>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <MdPhone className="text-gray-500" />
            <span className="font-medium">{restaurant.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdPerson className="text-gray-500" />
            <span className="font-medium">{restaurant.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdLocationOn className="text-gray-500" />
            <span className="font-medium truncate">{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdAttachMoney className="text-gray-500" />
            <span className="font-medium">BDT {restaurant.balance}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdAttachMoney className="text-gray-500" />
            <span className="font-medium">
              Total sales {restaurant.totalSales}
            </span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-col gap-2">
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
          <Link
            className="inline-block w-full text-center py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            to={`/restaurant/transactions?id=${restaurant._id}`}
          >
            Transactions
          </Link>
          <div className="flex gap-2 items-center ">
            <UpdateCakeRestaurant
              isCake={restaurant?.isCake}
              restaurantId={restaurant._id}
              setRestaurant={setRestaurant}
            />
            <UpdateIsHomeMade
              isHomeMade={restaurant?.isHomeMade}
              restaurantId={restaurant._id}
              setRestaurant={setRestaurant}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
