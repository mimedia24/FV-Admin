import React, { useState } from "react";

import { Card } from "antd";
import ChangeStatus from "./changeStatus";
import UpdateMenuDiscountRate from "./updateMenuDiscountRate";
export default function MenuCard({ menu, setMenus }) {
  const [status, setStatus] = useState(menu?.status);

  return (
    <Card
      style={{
        width: 300,
      }}
    >
      <div>
        <img
          className="w-20 h-20 rounded-full border-2 object-cover"
          src={menu?.image || "/images/menuIcon.png"}
          alt="image"
        />
      </div>

      <h1>
        Menu ID: <span>{menu._id}</span>
      </h1>
      <h1>
        Restaurant ID: <span>{menu.restaurantId}</span>
      </h1>
      <h1>
        Category: <span className="px-4 py-1 rounded-sm text-white bg-blue-500">{menu.category}</span>
      </h1>
      <h1>
        Title: <span>{menu.name}</span>
      </h1>
      <h1>
        Description: <span>{menu.description}</span>
      </h1>

      <h1>
        Based Price:{" "}
        <span className="text-lg font-bold">BDT {menu.basedPrice}</span>
      </h1>
      <h1>
        Discount Rate:{" "}
        <span className="text-lg font-bold">{menu.discountRate}%</span>
      </h1>
      <h1>
        Offer Price:{" "}
        <span className="text-lg font-bold">BDT {menu.offerPrice}</span>
      </h1>

      <h1 className="mt-2">
        status:{" "}
        <span
          className={
            status === "in stock"
              ? "px-4 py-1 text-white bg-blue-500"
              : status === "discontinued"
              ? "px-4 py-1 text-white bg-red-500"
              : status === "out of stock"
              ? "px-4 py-1 text-white bg-orange-500"
              : "px-4 py-1 text-white bg-gray-500"
          }
        >
          {status}
        </span>
      </h1>
      <div className="mt-4 flex flex-wrap gap-4">
        <ChangeStatus menu={menu} setStatus={setStatus} status={status} />
        <UpdateMenuDiscountRate menu={menu} />
      </div>
    </Card>
  );
}
