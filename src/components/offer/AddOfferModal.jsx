import { IoIosAddCircle } from "react-icons/io";
import { Button, Input, Modal } from "antd";
import { useState } from "react";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";
import toast from "react-hot-toast";

const defaultForm = {
  title: "",
  discountRate: "",
  link: "",
  status: "",
  thumbnail: null,
};

function AddOfferModal() {
  const [formData, setFormData] = useState(defaultForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("discountRate", formData.discountRate);
    form.append("link", formData.link);
    form.append("status", formData.status);

    if (formData.thumbnail) {
      form.append("thumbnail", formData.thumbnail);
    }

    const response = await axios.post(
      `${apiPath}/offer/banner/add-banner-offer`,
      form,
      {
        headers: {
          "x-auth-token": apiAuthToken,
        },
      }
    );

    // console.log(response.data);

    const data = await response.data;

    if (data.success) {
      toast.success(data.message);

      setFormData(defaultForm);
      setIsModalOpen(false);
    } else {
      toast.error(data.message);
    }

    //  setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function handleOnChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "thumbnail" && e.target.files) {
      setFormData((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    console.log(formData);
  }
  return (
    <>
      <Button type="primary" onClick={showModal}>
        <IoIosAddCircle /> add offer
      </Button>
      <Modal
        title="Add new offer"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form action="" encType="multipart/form-data">
          <Input
            placeholder="title"
            name="title"
            className="mt-2"
            onChange={handleOnChange}
            required
          />
          <Input
            placeholder="discountRate"
            name="discountRate"
            className="mt-2"
            onChange={handleOnChange}
            required
          />
          <Input
            placeholder="link"
            name="link"
            className="mt-2"
            onChange={handleOnChange}
            required
          />
          <Input
            placeholder="status"
            name="status"
            className="mt-2"
            onChange={handleOnChange}
            required
          />
          <Input
            placeholder=""
            name="thumbnail"
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={handleOnChange}
            required
          />
        </form>
      </Modal>
    </>
  );
}

export default AddOfferModal;
