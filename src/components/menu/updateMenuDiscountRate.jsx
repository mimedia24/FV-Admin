import { useState } from "react";
import { Button, Modal } from "antd";
import { Input } from "antd";
import handleApiRequest from "../../helpers/handleApiRequest";
import toast from "react-hot-toast";

export default function UpdateMenuDiscountRate({ menu, getMenus }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountRate, setDiscountRate] = useState(menu.discountRate);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const nextDiscountRate = Number(discountRate);
    if (
      !Number.isFinite(nextDiscountRate) ||
      nextDiscountRate < 0 ||
      nextDiscountRate > 100
    ) {
      toast.error("Discount must be between 0 and 100.");
      return;
    }

    const { result } = await handleApiRequest(
      `/admin/menu/update-discount-rate?id=${menu._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          discountRate: nextDiscountRate,
        }),
      }
    );

    console.log(result);

    if (result?.success) {
      toast.success(result?.message);
      getMenus();
    } else {
      toast.error(result?.message);
    }

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Update discount
      </Button>
      <Modal
        title="Update discount rate"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="update discount rate"
          value={discountRate}
          type="number"
          onChange={(event) => setDiscountRate(event.target.value)}
        />
      </Modal>
    </>
  );
}
