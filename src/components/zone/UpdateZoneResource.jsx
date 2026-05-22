import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../services/axios/axiosInstance";
import { IMAGE_PATH } from "../../../secrets";

const UpdateZoneResource = ({
  isVisible,
  onClose,
  zoneData,
  onUpdateSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const getImageUrl = (path) => {
    if (!path) return "";

    if (String(path).startsWith("http") || String(path).startsWith("data:")) {
      return path;
    }

    const cleanPath = String(path).startsWith("/") ? path : `/${path}`;
    return `${IMAGE_PATH}${cleanPath}`;
  };

  useEffect(() => {
    if (isVisible && zoneData) {
      form.setFieldsValue({
        phoneNumber: zoneData.resource?.contactInformation?.phoneNumber || "",
        email: zoneData.resource?.contactInformation?.email || "",
        whatsappNumber:
          zoneData.resource?.contactInformation?.whatsappNumber || "",
      });

      const existingBanners = Array.isArray(zoneData.resource?.banners)
        ? zoneData.resource.banners
        : [];

      const mappedBanners = existingBanners.map((path, index) => ({
        uid: path || `existing-${index}`,
        name: `Banner-${index + 1}`,
        status: "done",
        url: getImageUrl(path),
        isExisting: true,
        path,
      }));

      setFileList(mappedBanners);
    }

    if (!isVisible) {
      form.resetFields();
      setFileList([]);
    }
  }, [isVisible, zoneData, form]);

  const handleRemoveImage = async (file) => {
    if (!file.isExisting) {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      return true;
    }

    try {
      setLoading(true);

      await axiosInstance.delete(
        `/v3/master-admin/zone/remove/banner/${zoneData.id}`,
        {
          data: {
            imagePath: file.path,
          },
        }
      );

      message.success("Banner removed successfully");

      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      return true;
    } catch (error) {
      message.error(error.response?.data?.message || "Remove failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      const formData = new FormData();
      formData.append("phoneNumber", values.phoneNumber || "");
      formData.append("email", values.email || "");
      formData.append("whatsappNumber", values.whatsappNumber || "");

      const newFiles = fileList.filter((file) => file.originFileObj);

      if (newFiles.length > 0) {
        formData.append("image", newFiles[0].originFileObj);
      }

      await axiosInstance.put(
        `/v3/master-admin/zone/resource/${zoneData.id}`,
        formData
      );

      message.success("Zone resource updated successfully");

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      onClose();
    } catch (error) {
      message.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Update Zone Resource"
      open={isVisible}
      onCancel={onClose}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="phoneNumber" label="Phone Number">
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item name="whatsappNumber" label="WhatsApp Number">
          <Input placeholder="Enter WhatsApp number" />
        </Form.Item>

        <Form.Item label="Banners">
          <Upload
            listType="picture"
            fileList={fileList}
            onRemove={handleRemoveImage}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            accept="image/*"
            maxCount={2}
          >
            <Button icon={<UploadOutlined />}>Select Banner</Button>
          </Upload>

          <p style={{ marginTop: 8, color: "#777", fontSize: 12 }}>
            New banner upload করলে সেটা live server-এ save হবে।
          </p>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateZoneResource;