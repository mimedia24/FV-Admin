import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { Input } from "antd";
import handleApiRequest from "../../helpers/handleApiRequest";
import toast from "react-hot-toast";

export default function UpdateMenuPlateFormFee({ menu }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plateformFee, setPlateformFee] = useState(menu.plateformFee);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const { result, loading } = await handleApiRequest(
      `/menu/platform-fee/update?menu-id=${menu._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
            platformFee: Number(plateformFee),
        }),
      }
    );

    console.log(result);

    if (result?.success) {
      toast.success(result?.message);
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
        Update fee
      </Button>
      <Modal
        title="Update discount rate"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="update discount rate"
          value={plateformFee}
          type="number"
          onChange={(event) => setPlateformFee(event.target.value)}
        />
      </Modal>
    </>
  );
}
