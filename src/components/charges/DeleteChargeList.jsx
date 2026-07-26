import { useState } from "react";
import { Button, Modal } from "antd";
import { MdDelete } from "react-icons/md";

import axiosInstance from "../../services/axios/axiosInstance";
import toast from "react-hot-toast";

export default function DeleteChargeList({ item }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const { data } = await axiosInstance.delete(
        `/charges/delete-schedule?id=${item._id}`
      );

      console.log(data);

      if (data.success) {
        toast.success("delete successful.");
      } else {
        toast.error("failed to delete.");
      }
    } catch (error) {
      console.log(error.response);
      throw new Error(error);
    }

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <div>
      <Button
        className="px-2 py-1 rounded-lg border shadow-md bg-red-400 text-white"
        onClick={showModal}
      >
        <MdDelete />
      </Button>
      <Modal
        title="Delete schedule charges"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </div>
  );
}
