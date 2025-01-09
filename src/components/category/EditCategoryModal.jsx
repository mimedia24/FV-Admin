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
          <label htmlFor="name"
            className="mt-4">Category name</label>
          <Input
            placeholder="name"
            required
            name="name"
            value={formData.name}
            onChange={handleOnChange}
          />
          <label htmlFor="description"
            className="mt-4">Description</label>
          <Input
            placeholder="description"
            required
            name="description"
            value={formData.description}
            onChange={handleOnChange}
          />
          <label htmlFor="meta"
            className="mt-4">Meta Code</label>
          <Input
            placeholder="meta keywords"
            required
            name="meta"
            value={formData.meta}
            onChange={handleOnChange}
          />
          <label htmlFor="thumbnail"
            className="mt-4">Image</label>
          <Input
            required
            type="file"
            name="thumbnail"
            onChange={handleOnChange}
          />


          <div>
            <label htmlFor="isPopular">Is popular</label>
            <select name="isPopular" id="isPopular" className="w-full px-3 py-2" onChange={handleOnChange}>
              <option value="" disabled selected>Display category in home</option>
              <option value={true}>popular</option>
              <option value={false}>regular</option>
            </select>

          </div>

        </form>
      </Modal>
    </>
  );
}

export default EditCategoryModal;
