import ChangeStatus from "./changeStatus";
import { useState } from "react";
import AssignRiderModal from "./assignRiderModal";
import DeleteOrderButton from "./deleteOrderButton";
import convertDateAsLocalTime from "../helpers/timeStamp";
import ViewOrderItem from "./order/viewOrderItem";

export default function OrderCard({ order, slNo, getOrders }) {
  const [status, setStatus] = useState(order?.status);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateTime, setUpdateTime] = useState(
    convertDateAsLocalTime(order?.updateTime)
  );

  return (
    <tr className="text-center border text-sm">
      <td>{slNo + 1}</td>
      <td className="text-[13px] border">{order?._id}</td>
      <td className="border text-[14px] ">
        <span
          className={
            status === "pending"
              ? "px-2 py-1 bg-gray-400 text-white rounded-sm"
              : status === "delivered"
              ? "px-2 py-1 bg-blue-400 text-white rounded-sm"
              : status === "picked up"
              ? "px-2 py-1 bg-orange-400 text-white rounded-sm"
              : "px-2 py-1 bg-red-400 text-white rounded-sm"
          }
        >
          {status}
        </span>
      </td>
      <td className="text-[13px] border">{order?.userId}</td>
      <td className="text-[13px] border">{order?.restaurantId}</td>
      <td className="text-[13px] border">{order?.riderId || "N/A"}</td>
      <td className="border p-1">BDT {order?.totalAmount.toFixed()}</td>
      <td className="border p-1">BDT {order?.deliveryAmount.toFixed()}</td>
      <td className="border p-1 text-[12px]">{updateTime}</td>
      <td className="border p-1">
        <ChangeStatus order={order} status={status} setStatus={setStatus} />
      </td>
      <td className="border p-1 flex items-center justify-center">
        <button
          className="p-1 text-sm  bg-blue-500 text-white  me-4 rounded-sm mt-3 capitalize"
          onClick={() => setIsModalOpen(true)}
        >
          assign rider
        </button>

        <AssignRiderModal
          order={order}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </td>
      <td className="border p-1">
        <DeleteOrderButton order={order} getOrders={getOrders} />
      </td>
      <td>
        <ViewOrderItem order={order} />
      </td>
    </tr>
  );
}
