import React, { useState } from "react";

import { Card } from "antd";
import ChangeStatus from "./changeStatus";
import UpdateMenuDiscountRate from "./updateMenuDiscountRate";
export default function MenuCard({ menu, setMenus, slNo }) {
  const [status, setStatus] = useState(menu?.status);

  return (
    <tr className="w-full border text-center text-sm">
      <td className="text-sm text-center border px-3 py-1 min-w-20">{slNo + 1}</td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">{menu._id}</td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <img
          className="w-20 h-20 rounded-full border-2 object-cover"
          src={menu?.image || "/images/menuIcon.png"}
          alt="image"
        />
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">{menu.restaurantId}</td>

      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span className="px-3 py-1 text-center bg-blue-500 text-white min-w-16 inline-block">{menu.category}</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
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
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span>{menu.name}</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 overflow-scroll max-w-20">
        <span>{menu.description}</span>
      </td>

      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span className="text-lg font-bold">BDT {menu.basePrice}</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span className="text-lg font-bold">{menu.discountRate}%</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span className="text-lg font-bold">BDT {menu.offerPrice}</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <ChangeStatus menu={menu} setStatus={setStatus} status={status} />
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <UpdateMenuDiscountRate menu={menu} />
      </td>
    </tr>
  );
}
