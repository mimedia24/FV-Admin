import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";
import toast from "react-hot-toast";

function EditOfferModal({
  setIsModalOpen,
  isModalOpen,
  offer,
  setAdvertisement,
}) {
  const defaultFormData = {
    title: offer.title || "",
    discountRate: offer.discountRate || "",
    link: offer.link || "",
    status: offer.status || "",
    thumbnail: null,
  };

  const [formData, setFormData] = useState(defaultFormData);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("discountRate", formData.discountRate);
    form.append("link", formData.link);
    form.append("status", formData.status);
    form.append("thumbnail", formData.thumbnail);

    const response = await axios.put(
      `${apiPath}/offer/update-offer?id=${offer._id}`,
      form,
      {
        headers: {
          "x-auth-token": apiAuthToken,
        },
      }
    );
    const data = await response.data;

    if (data.success) {
      toast.success(data.message);
      setAdvertisement(data.offer);
      setIsModalOpen(false);
    } else {
      toast.error(data.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function handleOnChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (e.target.files && e.target.name == "thumbnail") {
      setFormData((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  return (
    <>
      <Modal
        title="Update offer image"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          name="title"
          placeholder="title"
          onChange={handleOnChange}
          value={formData.title}
        />
        <Input
          name="discountRate"
          placeholder="discountRate"
          className="mt-2"
          onChange={handleOnChange}
          value={formData.discountRate}
        />
        <Input
          name="link"
          placeholder="link"
          className="mt-2"
          onChange={handleOnChange}
          value={formData.link}
        />
        <Input
          name="status"
          placeholder="status"
          className="mt-2"
          value={formData.status}
          onChange={handleOnChange}
        />
        <Input
          name="thumbnail"
          placeholder="thumbnail"
          type="file"
          accept="imaga/*"
          className="mt-2"
          onChange={handleOnChange}
        />
      </Modal>
    </>
  );
}

export default EditOfferModal;
