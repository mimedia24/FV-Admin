import React, { useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Switch, 
  Upload, 
  Card, 
  Tabs, 
  message, 
  Typography, 
  Space 
} from "antd";
import { 
  UploadOutlined, 
  NotificationOutlined, 
  PictureOutlined, 
  SendOutlined,
  EyeOutlined
} from "@ant-design/icons";
import Layout from "./layout";
import { apiAuthToken, apiPath } from "../../secrets";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function Notification() {
  const [promoForm] = Form.useForm();
  const [generalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // --- Handle Promotional Submit ---
  const handlePromotionalSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error("Please upload a promotional image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("isPromotion", values.isPromotion ?? true);
    formData.append("type", values.type);
    formData.append("image", fileList[0].originFileObj);

    try {
      const response = await fetch(`${apiPath}/v2/notification/promotional-notification`, {
        method: "POST",
        headers: { "x-auth-token": apiAuthToken },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Promotional Notification posted successfully!");
        promoForm.resetFields();
        setFileList([]);
      } else {
        message.error(data.message || "Failed to post notification.");
      }
    } catch (error) {
      message.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Handle General Submit ---
  const handleGeneralSubmit = async (values) => {
    setLoading(true);
    const postData = {
      ...values,
      isPromotion: values.isPromotion ?? false,
    };

    try {
      const response = await fetch(`${apiPath}/v2/notification/post-with-out-image`, {
        method: "POST",
        headers: {
          "x-auth-token": apiAuthToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("General Post sent successfully!");
        generalForm.resetFields();
      } else {
        message.error(data.message || "Failed to send notification.");
      }
    } catch (error) {
      message.error("Network error. Please try again.");
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

  const tabItems = [
    {
      key: '1',
      label: <span className="px-2"><PictureOutlined /> Promotional (with Image)</span>,
      children: (
        <Form 
          form={promoForm} 
          layout="vertical" 
          onFinish={handlePromotionalSubmit}
          initialValues={{ type: 'public', isPromotion: true }}
        >
          <Form.Item name="title" label="Notification Title" rules={[{ required: true }]}>
            <Input placeholder="Enter catchy title..." size="large" />
          </Form.Item>
          
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Detailed promotional message..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="type" label="Visibility Type">
              <Select size="large">
                <Option value="public">🌍 Public</Option>
                <Option value="private">🔒 Private</Option>
              </Select>
            </Form.Item>
            <Form.Item name="isPromotion" label="Promotion Status" valuePropName="checked">
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
          </div>

          <Form.Item label="Upload Banner (Required)">
            <Upload.Dragger {...uploadProps} listType="picture" className="bg-gray-50">
              <p className="ant-upload-drag-icon"><PictureOutlined className="text-blue-400" /></p>
              <p className="ant-upload-text">Click or drag image to this area</p>
              <p className="ant-upload-hint">Support for a single image upload only.</p>
            </Upload.Dragger>
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SendOutlined />} 
            loading={loading} 
            block 
            size="large"
            className="h-12 font-bold bg-blue-600"
          >
            Post Promotional Notification
          </Button>
        </Form>
      ),
    },
    {
      key: '2',
      label: <span className="px-2"><NotificationOutlined /> General Post (No Image)</span>,
      children: (
        <Form 
          form={generalForm} 
          layout="vertical" 
          onFinish={handleGeneralSubmit}
          initialValues={{ type: 'public', isPromotion: false }}
        >
          <Form.Item name="title" label="Notification Title" rules={[{ required: true }]}>
            <Input placeholder="Enter notification title..." size="large" />
          </Form.Item>
          
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Type your message here..." />
          </Form.Item>

          <Form.Item name="type" label="Visibility Type">
            <Select size="large">
              <Option value="public">🌍 Public</Option>
              <Option value="private">🔒 Private</Option>
            </Select>
          </Form.Item>

          <Form.Item name="isPromotion" label="Is this a Promotion?" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SendOutlined />} 
            loading={loading} 
            block 
            size="large"
            className="h-12 font-bold bg-indigo-600"
          >
            Send General Notification
          </Button>
        </Form>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={2} className="m-0 flex items-center gap-2">
              <NotificationOutlined className="text-blue-600" /> Post Notifications
            </Title>
            <Text type="secondary">Create and broadcast notifications to your users</Text>
          </div>
          <Link to="/notification/all">
            <Button icon={<EyeOutlined />} size="large">View History</Button>
          </Link>
        </div>

        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <Tabs 
            defaultActiveKey="1" 
            items={tabItems} 
            centered 
            size="large"
            className="custom-tabs"
          />
        </Card>
      </div>

      <style>{`
        .custom-tabs .ant-tabs-nav::before { border-bottom: 1px solid #f0f0f0; }
        .ant-card-body { padding: 32px !important; }
        .ant-form-item-label label { font-weight: 600; color: #374151; }
      `}</style>
    </Layout>
  );
}

export default Notification;