import { Card } from "antd";
import React, { useState } from "react";
import ChangeRestaurantStatus from "./changeRestaurantStatus";

export default function RestaurantCard({ restaurant }) {
  const [status, setStatus] = useState(restaurant?.status);
  return (
    <Card className="w-[500px]">


<div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-gray-100">
        <img
          src={restaurant?.profileImage}
          alt=""
        />
      </div>

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
          restaurant={ restaurant }
          status={status}
          setStatus={setStatus}
        />
      </div>
    </Card>
  );
}
