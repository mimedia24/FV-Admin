import { useState } from "react";
import { Button, Modal } from "antd";
import { Input } from "antd";
import handleApiRequest from "../../helpers/handleApiRequest";
import toast from "react-hot-toast";

export default function UpdateMenuPlateFormFee({ menu, getMenus }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plateformFee, setPlateformFee] = useState(menu.plateformFee);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const nextPlatformFee = Number(plateformFee);
    if (!Number.isFinite(nextPlatformFee) || nextPlatformFee < 0) {
      toast.error("Platform fee must be zero or greater.");
      return;
    }

    const { result } = await handleApiRequest(
      `/menu/platform-fee/update?menu-id=${menu._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          platformFee: nextPlatformFee,
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
        Update fee
      </Button>
      <Modal
        title="Update flatform fee"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="update flatform fee"
          value={plateformFee}
          type="number"
          onChange={(event) => setPlateformFee(event.target.value)}
        />
      </Modal>
    </>
  );
}
