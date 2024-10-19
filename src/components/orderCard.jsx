import { Card } from "antd";
import ChangeStatus from "./changeStatus";
import { useState } from "react";
import AssignRiderModal from "./assignRiderModal";
import DeleteOrderButton from "./deleteOrderButton";
import convertDateAsLocalTime from "../helpers/timeStamp";
export default function OrderCard({ order }) {
  const [status, setStatus] = useState(order?.status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderTime, setOrderTime] = useState(
    convertDateAsLocalTime(order?.orderDate)
  );

  const [updateTime, setUpdateTime] = useState(
    convertDateAsLocalTime(order?.updateTime)
  );

  return (
    <Card style={{ width: 450 }}>
      <p>Order ID: {order?._id}</p>
      <p>
        Order ID:{" "}
        <span
          className={
            status === "Pending"
              ? "px-2 py-1 bg-gray-400 text-white rounded-sm"
              : status === "Delivered"
              ? "px-2 py-1 bg-blue-400 text-white rounded-sm"
              : status === "Picked Up"
              ? "px-2 py-1 bg-orange-400 text-white rounded-sm"
              : "px-2 py-1 bg-red-400 text-white rounded-sm"
          }
        >
          {status}
        </span>
      </p>
      <p>Restaturant ID: {order?.restaurantId}</p>
      <p>Rider ID: {order?.riderId || "N/A"}</p>
      <p>Total Amount: BDT {order?.totalAmount}</p>
      <p>Delivery Amount: BDT {order?.deliveryAmount}</p>
      <p>Order Time: {orderTime}</p>
      <p>Last update: {updateTime}</p>
      <div>
        <ChangeStatus order={order} status={status} setStatus={setStatus} />

        <button
          className="px-4 py-1 bg-blue-500 text-white  me-4 rounded-sm mt-3 capitalize"
          onClick={() => setIsModalOpen(true)}
        >
          Assign New Rider
        </button>

        <AssignRiderModal
          order={order}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />

        <DeleteOrderButton order={order} />
        
      </div>
    </Card>
  );
}
