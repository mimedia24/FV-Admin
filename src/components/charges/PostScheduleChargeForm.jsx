import { useState } from "react";
import { Button, Modal } from "antd";

import { Input } from "antd";
import axiosInstance from "../../services/axios/axiosInstance";
import toast from "react-hot-toast";

import { FaRegPlusSquare } from "react-icons/fa";

export default function PostScheduleCharge() {
  const defaultFormData = {
    riderFirstKMCharge: "",
    riderOthersKMCharge: "",
    userFirstKMCharge: "",
    userOthersKMCharge: "",
    isActive: null,
  };

  const [formData, setFormData] = useState(defaultFormData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const { data } = await axiosInstance.post(
        "/charges/post-schedule",
        {
          ...formData,
          riderFirstKMCharge: Number(formData.riderFirstKMCharge),
          riderOthersKMCharge: Number(formData.riderOthersKMCharge),
          userFirstKMCharge: Number(formData.userFirstKMCharge),
          userOthersKMCharge: Number(formData.userOthersKMCharge),
          isActive: String(formData.isActive) === "true",
        },
      );

      console.log(data);

      if (data.success) {
        toast.success("post new schedules successful.");
      } else {
        toast.error("post new schedules failed.");
      }
    } catch (error) {
      console.log(error.response);
      toast.error("post new schedules failed.");
      throw new Error(error);
    }

    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function handleOnChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prev) => ({ ...prev, [name]: value }));

    console.log(formData);
  }

  return (
    <div>
      <Button
        className="px-3 py-2 rounded-lg border shadow-md bg-white text-blue-700"
        onClick={showModal}
      >
        <FaRegPlusSquare />
      </Button>
      <Modal
        title="Update schedule charges"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="mt-4">
          <label htmlFor="">Rider first km charge</label>
          <Input
            placeholder="rider first km charge"
            type="number"
            name="riderFirstKMCharge"
            onChange={handleOnChange}
            value={formData.riderFirstKMCharge}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="">Rider others km charge</label>
          <Input
            placeholder="rider others km charge"
            type="number"
            name="riderOthersKMCharge"
            onChange={handleOnChange}
            value={formData.riderOthersKMCharge}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="">users first km charge</label>
          <Input
            placeholder="user first km charge"
            type="number"
            name="userFirstKMCharge"
            onChange={handleOnChange}
            value={formData.userFirstKMCharge}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="">user others km charge</label>
          <Input
            placeholder="user others km charge"
            type="number"
            name="userOthersKMCharge"
            onChange={handleOnChange}
            value={formData.userOthersKMCharge}
          />
        </div>
        <div>
          <label htmlFor="">select status</label>
          <select
            name="isActive"
            id=""
            onChange={handleOnChange}
            className="w-full px-2 py-2 rounded-lg border shadow-lg mt-2 text-black"
          >
            <option value="" disabled>
              select status
            </option>
            <option value={false} className="text-black">
              disabled
            </option>
            <option value={true} className="text-black">
              active
            </option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
