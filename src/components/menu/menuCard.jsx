import { useState } from "react";
import { Tag, Checkbox } from "antd";
import ChangeStatus from "./changeStatus";
import UpdateMenuDiscountRate from "./updateMenuDiscountRate";
import UpdateMenuPlateFormFee from "./UpdateMenuPlateformFee";
import axiosInstance from "../../services/axios/axiosInstance";
import { resolveImageUrl, useImageFallback } from "../../helpers/imageUrl";

export default function MenuCard({ menu, slNo, getMenus }) {
  const [status, setStatus] = useState(menu?.status);
  const [approvalStatus, setApprovalStatus] = useState(menu.isApproved);
  const [isPopular, setIsPopular] = useState(menu.isPopular);

  async function handleAdminApproved() {
    try {
      const { data } = await axiosInstance.put(
        `/menu/update/approval?approvalStatus=${!menu.isApproved}&menuId=${menu._id}`
      );
      if (data.success) {
        setApprovalStatus(!approvalStatus);
      }
    } catch (error) {
      console.error("Error updating approval status: ", error);
    }
  }

  async function handlePopularItem() {
    try {
      const { data } = await axiosInstance.put(
        `/menu/update/popular?status=${!menu.isPopular}&menuId=${menu._id}`
      );
      if (data.success) {
        setIsPopular(!isPopular);
      }
    } catch (error) {
      console.error("Error updating popular status: ", error);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "in stock":
        return "blue";
      case "discontinued":
        return "red";
      case "out of stock":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <tr className="w-full border-b hover:bg-gray-50 transition-colors duration-150">
      <td className="text-sm text-center px-3 py-2 min-w-[50px] font-medium text-gray-700">
        {slNo}
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[120px] text-gray-500 truncate">
        {menu._id}
      </td>
      <td className="text-sm text-center px-3 py-2">
        <img
          className="w-16 h-16 mx-auto rounded-full border object-cover shadow"
          src={resolveImageUrl(menu.image)}
          alt={menu.name}
          onError={useImageFallback}
        />
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[120px] text-gray-500 truncate">
        {menu.restaurantId}
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[80px]">
        <Tag color="blue">{menu.category}</Tag>
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[100px]">
        <Tag color={getStatusColor(status)}>{status}</Tag>
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[150px] font-semibold text-gray-800">
        {menu.name}
      </td>
      <td className="text-sm text-center px-3 py-2 max-w-[200px] overflow-hidden text-gray-600">
        <span className="line-clamp-2">{menu.description}</span>
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[90px] font-bold text-green-600">
        BDT {menu.basedPrice}
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[90px] font-bold text-gray-600">
        BDT {menu.plateformFee}
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[90px] font-bold text-blue-600">
        BDT {menu.sellingPrice}
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[80px] font-bold text-orange-500">
        {menu.discountRate}%
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[90px] font-bold text-red-500">
        BDT {menu.offerPrice}
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[120px]">
        <ChangeStatus
          menu={menu}
          setStatus={setStatus}
          status={status}
          getMenus={getMenus}
        />
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[120px]">
        <UpdateMenuDiscountRate menu={menu} getMenus={getMenus} />
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[120px]">
        <UpdateMenuPlateFormFee menu={menu} getMenus={getMenus} />
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[100px]">
        <Checkbox checked={approvalStatus} onChange={handleAdminApproved} />
      </td>
      <td className="text-sm text-center px-3 py-2 min-w-[80px]">
        <Checkbox checked={isPopular} onChange={handlePopularItem} />
      </td>
    </tr>
  );
}
