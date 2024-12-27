import React, { useState } from "react";
import { Button, Modal } from "antd";
import { RiSecurePaymentFill } from "react-icons/ri";
import PaymentFormRestaurant from "./PaymentFormRestaurant";

export default function PaymentModalRestaurant({
  restaurantId,
  getRestaurantWallet,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>
        <span className="text-lg cursor-pointer text-blue-500">
          <RiSecurePaymentFill />
        </span>
      </Button>
      <Modal
        title="Payment Rider"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <PaymentFormRestaurant
          restaurantId={restaurantId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          getRestaurantWallet={getRestaurantWallet}
        />
      </Modal>
    </>
  );
}
