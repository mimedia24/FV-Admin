import React, { useState } from "react";

import { Card } from "antd";
import ChangeStatus from "./changeStatus";
import UpdateMenuDiscountRate from "./updateMenuDiscountRate";
import UpdateMenuPlateFormFee from "./UpdateMenuPlateformFee";

export default function MenuCard({ menu, setMenus, slNo, getMenus }) {
  const [status, setStatus] = useState(menu?.status);

  return (
    <tr className="w-full border text-center text-sm">
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        {slNo + 1}
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        {menu._id}
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <img
          className="w-20 h-20 rounded-full border-2 object-cover"
          src={menu?.image || "/images/menuIcon.png"}
          alt="image"
        />
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        {menu.restaurantId}
      </td>

      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span className="px-3 py-1 text-center bg-blue-500 text-white min-w-16 inline-block">
          {menu.category}
        </span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span
          className={
            status === "in stock"
              ? "px-4 py-1 text-[11px] min-w-fit text-white bg-blue-500"
              : status === "discontinued"
              ? "px-4 py-1 text-[11px] min-w-fit text-white bg-red-500"
              : status === "out of stock"
              ? "px-4 py-1 text-[11px] min-w-fit text-white bg-orange-500"
              : "px-4 py-1 text-[11px] min-w-fit text-white bg-gray-500"
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
        <span className="text-[12px] font-bold">BDT {menu.basedPrice}</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span className="text-[12px] font-bold">BDT {menu.plateformFee}</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span className="text-[12px] font-bold">BDT {menu.sellingPrice}</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span className="text-[12px] font-bold">{menu.discountRate}%</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <span className="text-[12px] font-bold">BDT {menu.offerPrice}</span>
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <ChangeStatus
          menu={menu}
          setStatus={setStatus}
          status={status}
          getMenus={getMenus}
        />
      </td>
      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <UpdateMenuDiscountRate menu={menu} getMenus={getMenus} />
      </td>

      <td className="text-sm text-center border px-3 py-1 min-w-20">
        <UpdateMenuPlateFormFee menu={menu} getMenus={getMenus} />
      </td>
    </tr>
  );
}
