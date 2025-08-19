import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Form, Upload, message, Spin, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";
import toast from "react-hot-toast";

function EditCategoryModal({ setCategories, category, isModalOpenT }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenT);
  const [fileList, setFileList] = useState([]);

  // Set initial form values based on the category prop
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name || "",
        description: category.description || "",
        meta: category.meta || "",
        isPopular: category.isPopular || false,
      });
      // Optionally, set a file list for the existing thumbnail if you want to display it
      // Note: This would require a special component to show a preview from a URL
      setFileList([]);
    }
  }, [category, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("meta", values.meta);
      formData.append("isPopular", values.isPopular);

      if (fileList.length > 0) {
        formData.append("thumbnail", fileList[0].originFileObj);
      }

      const response = await axios.put(
        `${apiPath}/category/update?id=${category._id}`,
        formData,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        setCategories(data.category);
        setIsModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Edit category error:", error);
      toast.error("An error occurred while updating the category.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const uploadProps = {
    onRemove: (file) => {
      const newFileList = fileList.filter(item => item.uid !== file.uid);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // Prevent automatic upload
    },
    fileList,
    maxCount: 1,
    accept: "image/*",
  };

  return (
    <Modal
      title="Update Category"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Save Changes"
    >
      <Spin spinning={loading} tip="Updating category...">
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
          onFinish={handleOk}
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter a category name!" }]}
          >
            <Input
              placeholder="e.g., Electronics"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input
              placeholder="A brief description of the category."
            />
          </Form.Item>
          <Form.Item
            label="Meta Keywords"
            name="meta"
            rules={[{ required: true, message: "Please enter meta keywords!" }]}
          >
            <Input
              placeholder="e.g., phones, laptops, gadgets"
            />
          </Form.Item>
          <Form.Item
            label="Is Popular"
            name="isPopular"
            valuePropName="checked"
          >
            <Switch checkedChildren="Popular" unCheckedChildren="Regular" />
          </Form.Item>
          <Form.Item
            label="Thumbnail"
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Change Thumbnail</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default EditCategoryModal;
