import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, DatePicker, Upload, Button, message, Divider } from "antd";
import { UploadOutlined, TagOutlined } from "@ant-design/icons";
import axiosInstance from "../../services/axios/axiosInstance";

const { RangePicker } = DatePicker;

function AddVoucher({ isVisible, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      
      formData.append("code", values.code);
      formData.append("type", values.type);
      formData.append("value", values.value);
      formData.append("maxDiscount", values.maxDiscount || 0);
      formData.append("minCartAmount", values.minCartAmount || 0);
      formData.append("maxCartAmount", values.maxCartAmount || 0);
      formData.append("usageLimit", values.usageLimit);
      formData.append("perUserLimit", values.perUserLimit);
      formData.append("isActive", values.isActive ?? true);
      formData.append("firsOrderOnly", values.firsOrderOnly ?? false);
      formData.append("autoApply", values.autoApply ?? false);
      formData.append("anyRestaurant", values.anyRestaurant ?? false);
      formData.append("anyMenus", values.anyMenus ?? false);
      formData.append("applicableRestaurants", values.applicableRestaurants || "");
      formData.append("applicableMenus", values.applicableMenus || "");
      formData.append("applicableZones", values.applicableZones || "");

      if (values.dates && values.dates.length === 2) {
        formData.append("startAt", values.dates[0].toISOString());
        formData.append("expireAt", values.dates[1].toISOString());
      }

      if (fileList.length > 0) {
        formData.append("image", fileList[0]);
      }

      await axiosInstance.post("/v3/master-admin/voucher/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Voucher created successfully!");
      form.resetFields();
      setFileList([]);
      onSuccess();
      onClose();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to create voucher");
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
  };

  return (
    <Modal
      title={<span><TagOutlined /> Add New Voucher</span>}
      open={isVisible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="back" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>Create Voucher</Button>
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ type: 'PERCENTAGE', isActive: true }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="code" label="Voucher Code" rules={[{ required: true }]}>
            <Input placeholder="e.g. SAVE50" style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Form.Item name="type" label="Voucher Type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="PERCENTAGE">Percentage (%)</Select.Option>
              <Select.Option value="FLAT">Fixed Amount</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="value" label="Discount Value" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item name="dates" label="Validity Period" rules={[{ required: true }]}>
            <RangePicker className="w-full" showTime />
          </Form.Item>
        </div>

        <Divider orientation="left">Limits & Constraints</Divider>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item name="minCartAmount" label="Min Cart Amount">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="maxDiscount" label="Max Discount Limit">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="usageLimit" label="Total Usage Limit" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={1} />
          </Form.Item>
          <Form.Item name="perUserLimit" label="Per User Limit" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={1} />
          </Form.Item>
        </div>

        <Divider orientation="left">Applicability</Divider>
        
        <Form.Item name="applicableZones" label="Zone IDs (Comma Separated)">
          <Input placeholder="1, 2, 3" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="applicableRestaurants" label="Restaurant IDs">
            <Input placeholder="id1, id2" disabled={form.getFieldValue('anyRestaurant')} />
          </Form.Item>
          <Form.Item name="applicableMenus" label="Menu IDs">
            <Input placeholder="id1, id2" disabled={form.getFieldValue('anyMenus')} />
          </Form.Item>
        </div>

        <Divider />

        <div className="flex flex-wrap gap-6 mb-4">
          <Form.Item name="isActive" label="Active" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="firsOrderOnly" label="First Order Only" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="autoApply" label="Auto Apply" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="anyRestaurant" label="Any Restaurant" valuePropName="checked"><Switch onChange={() => form.setFieldsValue({applicableRestaurants: ''})} /></Form.Item>
          <Form.Item name="anyMenus" label="Any Menu" valuePropName="checked"><Switch onChange={() => form.setFieldsValue({applicableMenus: ''})} /></Form.Item>
        </div>

        <Form.Item label="Voucher Image">
          <Upload {...uploadProps} listType="picture">
            {fileList.length < 1 && <Button icon={<UploadOutlined />}>Select Image</Button>}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddVoucher;