import { Card } from "antd";
import ChangeStatus from "./changeStatus";
import { useState } from "react";
import AssignRiderModal from "./assignRiderModal";
export default function OrderCard({ order }) {
  const [status, setStatus] = useState(order?.status);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <p>Updated Time: {order?.updateTime}</p>

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
        <button className="px-4 py-1 bg-blue-500 text-white  me-4 rounded-sm mt-3 capitalize">
          delete order
        </button>
        <button className="px-4 py-1 bg-blue-300  me-4 rounded-md mt-3 capitalize">
          assign order
        </button>
      </div>
    </Card>
  );
}
