import React, { useState } from "react";
import { Button, Modal } from "antd";
import { FaPencilAlt } from "react-icons/fa";

import { Input } from "antd";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";
import toast from "react-hot-toast";

export default function UpdateChargeForm({ item }) {
  const [data, setData] = useState(item);

  const defaultFormData = {
    riderFirstKMCharge: data.riderFirstKMCharge,
    riderOthersKMCharge: data.userFirstKMCharge,
    userFirstKMCharge: data.userFirstKMCharge,
    userOthersKMCharge: data.userOthersKMCharge,
    isActive: data.isActive,
  };

  const [formData, setFormData] = useState(defaultFormData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const { data } = await axios.put(
        `${apiPath}/charges/update-schedule?id=${item._id}`,
        {
          ...formData,
        },
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      console.log(data);

      if (data.success) {
        toast.success("update successful.");
        setData(data.charges);
      } else {
        toast.error("failed to update.");
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

  function handleOnChange(e) {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prev) => ({ ...prev, [name]: value }));

    console.log(formData);
  }

  return (
    <div>
      <Button
        className="px-2 py-1 rounded-lg border shadow-md bg-white text-blue-700"
        onClick={showModal}
      >
        <FaPencilAlt />
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
            <option
              value={false}
              selected={item.isActive}
              className="text-black"
            >
              disabled
            </option>
            <option
              value={true}
              selected={item.isActive}
              className="text-black"
            >
              active
            </option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
