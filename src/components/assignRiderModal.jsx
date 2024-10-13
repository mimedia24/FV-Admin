import React, { useState } from "react";
import { Modal } from "antd";
import { Input } from "antd";
import handleApiRequest from "../helpers/handleApiRequest";

export default function AssignRiderModal({
  isModalOpen,
  setIsModalOpen,
  order,
}) {
  const [riderId, setRiderId] = useState(null);

  const handleOk = async () => {
    setIsModalOpen(false);

    setRiderId(null);

    // assign new rider
    const { result, loading } = await handleApiRequest(
      `/rider/assign-rider?orderId=${order._id}&riderId=${riderId}`,
      {
        method: "PUT",
      }
    );

    if (result) {
      console.log(result);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setRiderId(null);
  };

  return (
    <>
      <Modal
        title="Assign Rider"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <p>Order ID</p>
          <Input value={order._id} disabled />
        </div>
        <div>
          <p>Rider ID</p>
          <Input
            placeholder="rider id"
            value={riderId}
            onChange={(event) => setRiderId(event.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
