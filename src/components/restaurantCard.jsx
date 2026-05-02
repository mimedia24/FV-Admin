import React, { useMemo, useState } from "react";
import { Card, Tag, Popconfirm, Button, message, InputNumber } from "antd";
import { Link } from "react-router-dom";
import {
  MdDelete,
  MdLocationOn,
  MdPhone,
  MdPerson,
  MdAttachMoney,
  MdPercent,
} from "react-icons/md";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import ChangeRestaurantStatus from "./changeRestaurantStatus";
import UpdateCakeRestaurant from "./restaurant/UpdateCakeRestaurant";
import UpdateIsHomeMade from "./restaurant/UpdateHome";
import { CopyFilled } from "@ant-design/icons";
import UpdateOpenClose from "./restaurant/UpdateOpenClose";
import OpenCloseTime from "./restaurant/OpenCloseTime";

export default function RestaurantCard({
  restaurant,
  setRestaurant,
  restaurantList,
}) {
  const [status, setStatus] = useState(restaurant?.status);
  const [commissionRate, setCommissionRate] = useState(
    Number(restaurant?.commissionRate || 0)
  );
  const [savingCommission, setSavingCommission] = useState(false);

  function updateRestaurants(id) {
    const filterItem = restaurantList.filter((item) => item._id !== id);
    setRestaurant(filterItem);
  }

  function updateSingleRestaurant(updatedRestaurant) {
    const updatedList = restaurantList.map((item) =>
      item._id === updatedRestaurant._id ? { ...item, ...updatedRestaurant } : item
    );
    setRestaurant(updatedList);
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.success("ID copied to clipboard!");
  };

  const handleSaveCommission = async () => {
    try {
      setSavingCommission(true);

      const parsedRate = Number(commissionRate);

      if (!Number.isFinite(parsedRate) || parsedRate < 0) {
        message.error("Please enter a valid commission rate");
        return;
      }

      const { data } = await axios.put(
        `${apiPath}/restaurant/update-commission/${restaurant._id}`,
        { commissionRate: parsedRate },
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (data?.success) {
        updateSingleRestaurant(data.result);
        message.success("Commission updated successfully");
      } else {
        message.error(data?.message || "Failed to update commission");
      }
    } catch (error) {
      console.error("Update commission error:", error);
      message.error(
        error?.response?.data?.message || "Failed to update commission"
      );
    } finally {
      setSavingCommission(false);
    }
  };

  const shortId = useMemo(() => {
    return restaurant?._id ? `${restaurant._id.slice(0, 8)}...` : "N/A";
  }, [restaurant?._id]);

  return (
    <Card
      className="relative w-full max-w-xs rounded-xl border border-gray-200 bg-white shadow-lg"
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-md">
          <img
            src={import.meta.env.VITE_IMAGE_PATH + restaurant.image}
            alt="Restaurant"
            className="h-full w-full object-cover"
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
              className="border-none p-0 hover:bg-gray-100"
            />
          </Popconfirm>
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4">
        <div className="text-center">
          <h2 className="truncate text-base font-bold">{restaurant.name}</h2>
          <p className="truncate text-xs text-gray-500">
            {restaurant.description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Tag
            color="blue"
            className="flex cursor-pointer items-center gap-1 text-xs transition hover:opacity-80"
            onClick={() => handleCopy(restaurant._id)}
          >
            ID: {shortId}
            <CopyFilled size={12} className="ml-1" />
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
            <span className="truncate font-medium">{restaurant.address}</span>
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

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
          <div className="mb-2 flex items-center gap-2">
            <MdPercent className="text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wide text-blue-700">
              Restaurant Commission
            </span>
          </div>

          <div className="flex items-center gap-2">
            <InputNumber
              min={0}
              max={100}
              value={commissionRate}
              onChange={(value) => setCommissionRate(Number(value || 0))}
              className="!h-10 !w-full"
              placeholder="Commission %"
            />
            <Button
              type="primary"
              loading={savingCommission}
              onClick={handleSaveCommission}
              className="!h-10 !rounded-lg !bg-blue-600 !px-4"
            >
              Save
            </Button>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Current: <span className="font-bold">{Number(restaurant?.commissionRate || 0)}%</span>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex flex-col gap-2">
          <ChangeRestaurantStatus
            restaurant={restaurant}
            status={status}
            setStatus={setStatus}
          />

          <Link
            className="inline-block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700"
            to={`/restaurant/menu-list/${restaurant._id}`}
          >
            View Menu
          </Link>

          <Link
            className="inline-block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700"
            to={`/restaurant/transactions?id=${restaurant._id}`}
          >
            Transactions
          </Link>

          <div className="flex flex-wrap items-center gap-2">
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

            <UpdateOpenClose
              isOpen={restaurant?.isOpen}
              restaurantId={restaurant._id}
              setRestaurant={setRestaurant}
            />
          </div>

          <div>
            <OpenCloseTime
              restaurantId={restaurant._id}
              openingTime={restaurant.openingTime}
              closingTime={restaurant.closingTime}
              setRestaurant={setRestaurant}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}