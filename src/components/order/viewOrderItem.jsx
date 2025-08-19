import React, { useState } from "react";
import { Modal, Button } from "antd";
export default function ViewOrderItem({ order }) {
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
      <Button type="primary" onClick={showModal}>
        view
      </Button>
      <Modal
        title="Order Items list"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <span>
          <table className="w-full border">
            <thead>
              <tr>
                <td className="py-4 px-2 border text-center">SL No</td>
                <td className="py-4 px-2 border text-center">Items Name</td>
                <td className="py-4 px-2 border text-center">
                  restaurant price
                </td>
                <td className="py-4 px-2 border text-center">
                  Restaurant total
                </td>
                     <td className="py-4 px-2 border text-center">
                  Selling price
                </td>
                <td className="py-4 px-2 border text-center">
                  Selling total
                </td>
                <td className="py-4 px-2 border text-center">Quantity</td>
              </tr>
            </thead>
            <tbody>
              {order &&
                order.items.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="border text-center py-3 px-1">
                        {index + 1}
                      </td>
                      <td className="border text-center py-3 px-1">
                        {item.name}
                      </td>
                      <td className="border text-center py-3 px-1">
                        {item.basedPrice}
                      </td>

                      <td className="border text-center py-3 px-1">
                        {item.quantity * item.basedPrice}
                      </td>

                        <td className="border text-center py-3 px-1">
                        {item.offerPrice}
                      </td>

                      <td className="border text-center py-3 px-1">
                        {item.quantity * item.offerPrice}
                      </td>
                      <td className="border text-center py-3 px-1">
                        {item.quantity}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </span>
      </Modal>
    </>
  );
}
