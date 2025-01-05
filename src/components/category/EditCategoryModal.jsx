import { IoMdAdd } from "react-icons/io";
import { Button, Input, Modal } from "antd";
import { useState } from "react";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";
import toast from "react-hot-toast";

function EditCategoryModal({ setCategories, category, isModalOpenT }) {
  const defaultForm = {
    name: category.name || "",
    description: category.description || "",
    meta: category.meta || "",
    thumbnail: null,
    isPopular: category.isPopular
  };

  const [formData, setFormData] = useState(defaultForm);
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenT);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("meta", formData.meta);
    form.append("isPopular", formData.isPopular);

    if (formData.thumbnail) {
      form.append("thumbnail", formData.thumbnail);
    }

    const response = await axios.put(
      `${apiPath}/category/update?id=${category._id}`,
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
      setCategories(data.category);
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
      <Modal
        title="update category"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form action="" encType="multipart/form-data">
          <Input
            placeholder="name"
            required
            className="mt-4"
            name="name"
            value={formData.name}
            onChange={handleOnChange}
          />
          <Input
            placeholder="description"
            required
            name="description"
            className="mt-4"
            value={formData.description}
            onChange={handleOnChange}
          />
          <Input
            placeholder="meta keywords"
            required
            name="meta"
            className="mt-4"
            value={formData.meta}
            onChange={handleOnChange}
          />
          <Input
            required
            type="file"
            className="mt-4"
            name="thumbnail"
            onChange={handleOnChange}
          />


          <div>
            <select name="isPopular" id="isPopular" className="w-full px-3 py-2 mt-4" onChange={handleOnChange}>
              <option value="" disabled selected>select option</option>
              <option value={true}>active</option>
              <option value={false}>disabled</option>
            </select>

          </div>

        </form>
      </Modal>
    </>
  );
}

export default EditCategoryModal;
