import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Upload,
  Button,
  message,
  Row,
  Col,
  Divider,
  Typography
} from "antd";
import { UploadOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import axiosInstance from "../../services/axios/axiosInstance";

const { Option } = Select;
const { Text } = Typography;

export default function UpdateVoucher({ isVisible, onClose, onSuccess, editingVoucher }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (editingVoucher && isVisible) {
      form.setFieldsValue({
        ...editingVoucher,
        code: editingVoucher.code?.toUpperCase(),
        startAt: editingVoucher.startAt ? dayjs(editingVoucher.startAt) : null,
        expireAt: editingVoucher.expireAt ? dayjs(editingVoucher.expireAt) : null,
        // Array গুলোকে কমা সেপারেটেড স্ট্রিং-এ রূপান্তর (যদি ব্যাকএন্ড থেকে অ্যারে আসে)
        applicableRestaurants: Array.isArray(editingVoucher.applicableRestaurants) 
          ? editingVoucher.applicableRestaurants.join(", ") : editingVoucher.applicableRestaurants,
        applicableMenus: Array.isArray(editingVoucher.applicableMenus) 
          ? editingVoucher.applicableMenus.join(", ") : editingVoucher.applicableMenus,
        applicableZones: Array.isArray(editingVoucher.applicableZones) 
          ? editingVoucher.applicableZones.join(", ") : editingVoucher.applicableZones,
      });
      setFileList([]);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [editingVoucher, isVisible, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (values[key] === undefined || values[key] === null) return;

        if (key === "startAt" || key === "expireAt") {
          formData.append(key, values[key].toISOString());
        } else {
          formData.append(key, values[key]);
        }
      });

      if (fileList.length > 0 && fileList[0]) {
        formData.append("image", fileList[0]);
      }

      const response = await axiosInstance.put(
        `/v3/master-admin/voucher/update/${editingVoucher._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        message.success("Voucher updated successfully!");
        onSuccess();
        onClose();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update voucher");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
    accept: "image/*",
  };

  // Watch for switch changes to disable/enable ID inputs
  const anyRestaurant = Form.useWatch('anyRestaurant', form);
  const anyMenus = Form.useWatch('anyMenus', form);

  return (
    <Modal
      title={<span className="text-amber-500"><EditOutlined /> Update Voucher: {editingVoucher?.code}</span>}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
      styles={{ body: { backgroundColor: "#111827", color: "white", padding: "24px" } }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} className="custom-dark-form">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="code" label="Voucher Code" rules={[{ required: true }]}>
              <Input placeholder="e.g. SAVE50" className="uppercase h-10" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="type" label="Voucher Type" rules={[{ required: true }]}>
              <Select className="h-10">
                <Option value="PERCENTAGE">Percentage (%)</Option>
                <Option value="FIXED">Fixed Amount</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="value" label="Discount Value" rules={[{ required: true }]}>
              <InputNumber className="w-full h-10 flex items-center" min={0} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Start Date" name="startAt" rules={[{ required: true }]}>
              <DatePicker showTime className="w-full h-10" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Expiry Date" name="expireAt" rules={[{ required: true }]}>
              <DatePicker showTime className="w-full h-10" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" className="border-gray-800 text-gray-400">Limits & Constraints</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="minCartAmount" label="Min Cart">
              <InputNumber className="w-full h-10 flex items-center" min={0} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="maxDiscount" label="Max Discount">
              <InputNumber className="w-full h-10 flex items-center" min={0} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="usageLimit" label="Total Limit" rules={[{ required: true }]}>
              <InputNumber className="w-full h-10 flex items-center" min={1} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="perUserLimit" label="Per User" rules={[{ required: true }]}>
              <InputNumber className="w-full h-10 flex items-center" min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" className="border-gray-800 text-gray-400">Applicability Scope</Divider>

        <Form.Item name="applicableZones" label="Zone IDs (Comma Separated)">
          <Input placeholder="1, 2, 3" className="h-10" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="applicableRestaurants" label="Restaurant IDs">
              <Input placeholder="id1, id2" className="h-10" disabled={anyRestaurant} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="applicableMenus" label="Menu IDs">
              <Input placeholder="id1, id2" className="h-10" disabled={anyMenus} />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex flex-wrap gap-x-8 gap-y-4 bg-gray-800/30 p-4 rounded-xl mb-6">
          <Form.Item name="isActive" label="Active" valuePropName="checked" className="m-0"><Switch size="small" /></Form.Item>
          <Form.Item name="firsOrderOnly" label="1st Order" valuePropName="checked" className="m-0"><Switch size="small" /></Form.Item>
          <Form.Item name="autoApply" label="Auto Apply" valuePropName="checked" className="m-0"><Switch size="small" /></Form.Item>
          <Form.Item name="anyRestaurant" label="Any Restaurant" valuePropName="checked" className="m-0">
            <Switch size="small" onChange={(val) => val && form.setFieldsValue({applicableRestaurants: ''})} />
          </Form.Item>
          <Form.Item name="anyMenus" label="Any Menu" valuePropName="checked" className="m-0">
            <Switch size="small" onChange={(val) => val && form.setFieldsValue({applicableMenus: ''})} />
          </Form.Item>
        </div>

        <Form.Item label="Update Banner Image">
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />} className="bg-gray-800 text-gray-300 border-gray-700 h-10">
              Select New Image
            </Button>
          </Upload>
          {editingVoucher?.image && fileList.length === 0 && (
            <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
              <EyeOutlined /> Current: {editingVoucher.image.split('/').pop()}
            </div>
          )}
        </Form.Item>

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onClose} className="bg-transparent text-gray-400 border-gray-700">Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} className="bg-amber-600 border-none px-10 h-10 font-bold">
            Update Voucher
          </Button>
        </div>
      </Form>

      <style>{`
        .custom-dark-form .ant-form-item-label > label { color: #9ca3af !important; font-size: 12px; }
        .custom-dark-form .ant-input, .custom-dark-form .ant-input-number, .custom-dark-form .ant-select-selector, .custom-dark-form .ant-picker {
          background-color: #1f2937 !important;
          border-color: #374151 !important;
          color: white !important;
        }
        .ant-modal-content { background-color: #111827 !important; border: 1px solid #374151; border-radius: 16px !important; }
        .ant-modal-close { color: white !important; }
        .ant-divider-inner-text { color: #6b7280 !important; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
      `}</style>
    </Modal>
  );
}