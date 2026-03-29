import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../services/axios/axiosInstance";
import { IMAGE_PATH } from "../../../secrets";

const UpdateZoneResource = ({ isVisible, onClose, zoneData, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (isVisible && zoneData) {
      form.setFieldsValue({
        phoneNumber: zoneData.resource?.contactInformation?.phoneNumber,
        email: zoneData.resource?.contactInformation?.email,
        whatsappNumber: zoneData.resource?.contactInformation?.whatsappNumber,
      });

      if (zoneData.resource?.banners) {
        const existingBanners = zoneData.resource.banners.map((path, index) => ({
          uid: path,
          name: `Banner-${index + 1}`,
          status: "done",
          url: `${IMAGE_PATH}${path}`,
          isExisting: true,
          path: path,
        }));
        setFileList(existingBanners);
      }
    }
  }, [isVisible, zoneData, form]);

  const handleRemoveImage = async (file) => {
    if (!file.isExisting) {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.delete(`/v3/master-admin/zone/remove/banner/${zoneData.id}`, {
        data: { imagePath: file.path }
      });
      
      message.success("Banner removed");
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      if (onUpdateSuccess) onUpdateSuccess(); 
    } catch (error) {
      message.error(error.response?.data?.message || "Remove failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    // এখানে আমরা নিশ্চিত করছি যে ফাইল লিস্টে থাকা নতুন ফাইলগুলো যেন originFileObj পায়
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

      // ১টি মাত্র নতুন ফাইল পাঠানোর লজিক
      const newFile = fileList.find((file) => file.originFileObj);

      if (newFile) {
        // AntD originFileObj-এ আসল ফাইল ডাটা রাখে
        formData.append("image", newFile.originFileObj);
      }

      await axiosInstance.put(
        `/v3/master-admin/zone/resource/${zoneData.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      message.success("Updated successfully");
      onUpdateSuccess();
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
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>Update</Button>,
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

        <Form.Item label="Banners (Max 1 at a time)">
          <Upload
            listType="picture"
            fileList={fileList}
            onRemove={handleRemoveImage}
            onChange={handleUploadChange}
            beforeUpload={() => {
              return false;
            }}
            maxCount={fileList.filter(f => f.isExisting).length + 1}
          >
            <Button icon={<UploadOutlined />}>Select Banner</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateZoneResource;