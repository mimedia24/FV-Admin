import React, { useState } from "react";
import { Button, Input, Modal, Form, Upload, Spin } from "antd";
import { IoMdAdd } from "react-icons/io";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";
import toast from "react-hot-toast";

const defaultForm = {
  name: "",
  description: "",
  meta: "",
};

function AddCategoryModal({ setCategories }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [fileList, setFileList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("meta", formData.meta);

      if (fileList.length > 0) {
        formDataToSend.append(
          "thumbnail",
          fileList[0].originFileObj || fileList[0]
        );
      }

      const response = await axios.post(
        `${apiPath}/category/add`,
        formDataToSend,
        {
          headers: {
            "x-auth-token": apiAuthToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        setCategories(data.category);
        setFormData(defaultForm);
        setFileList([]);
        form.resetFields();
        setIsModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Add category error:", error);
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData(defaultForm);
    setFileList([]);
    form.resetFields();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // prevent auto upload
    },
    fileList,
    maxCount: 1,
    accept: "image/*",
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        className="flex items-center gap-1"
      >
        <IoMdAdd /> Add Category
      </Button>
      <Modal
        title="Add New Category"
        open={isModalOpen}
        onCancel={handleCancel}
        confirmLoading={loading}
        footer={null} // use form submit button instead
      >
        <Spin spinning={loading} tip="Adding category...">
          <Form
            form={form}
            layout="vertical"
            className="mt-4"
            onFinish={handleOk}
          >
            <Form.Item
              label="Category Name"
              name="name"
              rules={[
                { required: true, message: "Please enter a category name!" },
              ]}
            >
              <Input
                placeholder="e.g., Electronics"
                name="name"
                onChange={handleFormChange}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter a description!" },
              ]}
            >
              <Input
                placeholder="A brief description of the category."
                name="description"
                onChange={handleFormChange}
              />
            </Form.Item>

            <Form.Item
              label="Meta Keywords"
              name="meta"
              rules={[
                { required: true, message: "Please enter meta keywords!" },
              ]}
            >
              <Input
                placeholder="e.g., phones, laptops, gadgets"
                name="meta"
                onChange={handleFormChange}
              />
            </Form.Item>

            <Form.Item
              label="Thumbnail"
              name="thumbnail"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[
                { required: true, message: "Please upload a thumbnail!" },
              ]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add Category
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}

export default AddCategoryModal;
