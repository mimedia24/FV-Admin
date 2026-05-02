import React, { useMemo, useState } from "react";
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
} from "antd";
import {
  NotificationOutlined,
  PictureOutlined,
  SendOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  TagsOutlined,
  ReloadOutlined,
  BellOutlined,
  GlobalOutlined,
  LockOutlined,
} from "@ant-design/icons";
import Layout from "./layout";
import { apiAuthToken, apiPath } from "../../secrets";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const statThemes = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-600",
    border: "border-blue-200",
    glow: "shadow-[0_10px_40px_rgba(37,99,235,0.10)]",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-600",
    border: "border-emerald-200",
    glow: "shadow-[0_10px_40px_rgba(16,185,129,0.10)]",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-600",
    border: "border-amber-200",
    glow: "shadow-[0_10px_40px_rgba(245,158,11,0.10)]",
  },
};

function Notification() {
  const [promoForm] = Form.useForm();
  const [generalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const hasPromoImage = useMemo(() => fileList.length > 0, [fileList]);

  const handlePromotionalSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error("Please upload a promotional image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("isPromotion", String(values.isPromotion ?? true));
    formData.append("type", values.type);

    const fileToUpload = fileList[0].originFileObj || fileList[0];
    formData.append("image", fileToUpload);

    try {
      const response = await fetch(
        `${apiPath}/v2/notification/promotional-notification`,
        {
          method: "POST",
          headers: {
            "x-auth-token": apiAuthToken,
          },
          body: formData,
        }
      );

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

  const handleGeneralSubmit = async (values) => {
    setLoading(true);
    const postData = {
      ...values,
      isPromotion: values.isPromotion ?? false,
    };

    try {
      const response = await fetch(
        `${apiPath}/v2/notification/post-with-out-image`,
        {
          method: "POST",
          headers: {
            "x-auth-token": apiAuthToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

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
      key: "1",
      label: (
        <span className="px-2 font-semibold">
          <PictureOutlined /> Promotional (with Image)
        </span>
      ),
      children: (
        <Form
          form={promoForm}
          layout="vertical"
          onFinish={handlePromotionalSubmit}
          initialValues={{ type: "public", isPromotion: true }}
        >
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_330px]">
            <div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Promotional Content
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Banner Notification
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Create a promotional post with image, title and broadcast
                    details.
                  </p>
                </div>

                <Form.Item
                  name="title"
                  label={<span className="font-semibold text-slate-700">Notification Title</span>}
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Enter catchy title..."
                    size="large"
                    className="!h-12 !rounded-2xl"
                  />
                </Form.Item>

                <Form.Item
                  name="description"
                  label={<span className="font-semibold text-slate-700">Description</span>}
                  rules={[{ required: true }]}
                >
                  <TextArea
                    rows={5}
                    placeholder="Detailed promotional message..."
                    className="!rounded-2xl"
                  />
                </Form.Item>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Form.Item
                    name="type"
                    label={<span className="font-semibold text-slate-700">Visibility Type</span>}
                  >
                    <Select size="large" className="notification-select">
                      <Option value="public">🌍 Public</Option>
                      <Option value="private">🔒 Private</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="isPromotion"
                    label={<span className="font-semibold text-slate-700">Promotion Status</span>}
                    valuePropName="checked"
                  >
                    <div className="flex h-[52px] items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                      <Switch checkedChildren="ON" unCheckedChildren="OFF" />
                      <span className="ml-3 text-sm font-semibold text-slate-600">
                        Promotional message enabled
                      </span>
                    </div>
                  </Form.Item>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Media Upload
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Banner Image
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Upload one promotional banner for the notification card.
                  </p>
                </div>

                <Form.Item label={<span className="font-semibold text-slate-700">Upload Banner (Required)</span>}>
                  <Upload.Dragger
                    {...uploadProps}
                    listType="picture"
                    className="!rounded-2xl !border-slate-200 !bg-slate-50"
                  >
                    <p className="ant-upload-drag-icon">
                      <PictureOutlined className="text-blue-500 text-3xl" />
                    </p>
                    <p className="ant-upload-text font-semibold text-slate-700">
                      Click or drag image to this area
                    </p>
                    <p className="ant-upload-hint text-slate-500">
                      Support for a single image upload only.
                    </p>
                  </Upload.Dragger>
                </Form.Item>

                <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  {hasPromoImage
                    ? "Banner selected and ready to publish."
                    : "Please upload one image before posting this promotional notification."}
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={loading}
                  block
                  size="large"
                  className="!mt-5 !h-12 !rounded-2xl !border-0 !bg-gradient-to-r !from-blue-600 !to-violet-600 !font-bold shadow-lg shadow-blue-200/50"
                >
                  Post Promotional Notification
                </Button>
              </div>
            </div>
          </div>
        </Form>
      ),
    },
    {
      key: "2",
      label: (
        <span className="px-2 font-semibold">
          <NotificationOutlined /> General Post (No Image)
        </span>
      ),
      children: (
        <Form
          form={generalForm}
          layout="vertical"
          onFinish={handleGeneralSubmit}
          initialValues={{ type: "public", isPromotion: false }}
        >
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
            <div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    General Broadcast
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Text Notification
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Send a standard text-only announcement to your users.
                  </p>
                </div>

                <Form.Item
                  name="title"
                  label={<span className="font-semibold text-slate-700">Notification Title</span>}
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Enter notification title..."
                    size="large"
                    className="!h-12 !rounded-2xl"
                  />
                </Form.Item>

                <Form.Item
                  name="description"
                  label={<span className="font-semibold text-slate-700">Description</span>}
                  rules={[{ required: true }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Type your message here..."
                    className="!rounded-2xl"
                  />
                </Form.Item>
              </div>
            </div>

            <div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Delivery Settings
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Broadcast Rules
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Configure visibility and whether the message is promotional.
                  </p>
                </div>

                <Form.Item
                  name="type"
                  label={<span className="font-semibold text-slate-700">Visibility Type</span>}
                >
                  <Select size="large" className="notification-select">
                    <Option value="public">🌍 Public</Option>
                    <Option value="private">🔒 Private</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="isPromotion"
                  label={<span className="font-semibold text-slate-700">Is this a Promotion?</span>}
                  valuePropName="checked"
                >
                  <div className="flex h-[52px] items-center rounded-2xl border border-slate-200 bg-slate-50 px-4">
                    <Switch />
                    <span className="ml-3 text-sm font-semibold text-slate-600">
                      Mark this message as promotional
                    </span>
                  </div>
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={loading}
                  block
                  size="large"
                  className="!mt-5 !h-12 !rounded-2xl !border-0 !bg-gradient-to-r !from-indigo-600 !to-fuchsia-600 !font-bold shadow-lg shadow-indigo-200/50"
                >
                  Send General Notification
                </Button>
              </div>
            </div>
          </div>
        </Form>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-[1450px] px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-500 text-white shadow-lg shadow-blue-200/50">
                <NotificationOutlined className="text-[28px]" />
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-500">
                  <ThunderboltOutlined />
                  Broadcast Communication Center
                </div>

                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontWeight: 800,
                    lineHeight: 1.15,
                  }}
                >
                  Post Notifications
                </Title>

                <Text className="text-slate-500 text-sm md:text-base">
                  Create promotional and general notifications for your users
                  from one premium admin panel.
                </Text>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/notification/all">
                <Button
                  icon={<EyeOutlined />}
                  size="large"
                  className="!h-11 !rounded-xl !border-slate-200 !text-slate-700 !font-semibold"
                >
                  View History
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<BellOutlined />}
            label="Broadcast Types"
            value={2}
            helper="Promotional and general notification flows"
            color="blue"
          />
          <StatCard
            icon={<TagsOutlined />}
            label="Promotion Ready"
            value={hasPromoImage ? 1 : 0}
            helper="Banner upload status for promotional post"
            color="emerald"
          />
          <StatCard
            icon={<GlobalOutlined />}
            label="Visibility Modes"
            value={2}
            helper="Public and private audience targeting"
            color="amber"
          />
        </div>

        {/* Form Card */}
        <Card className="overflow-hidden rounded-[28px] border border-slate-200 shadow-sm">
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            centered
            size="large"
            className="notification-premium-tabs"
          />
        </Card>
      </div>

      <style>{`
        .notification-premium-tabs .ant-tabs-nav {
          margin-bottom: 28px !important;
        }

        .notification-premium-tabs .ant-tabs-nav::before {
          border-bottom: 1px solid #e5e7eb !important;
        }

        .notification-premium-tabs .ant-tabs-tab {
          color: #64748b !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          padding: 14px 8px !important;
        }

        .notification-premium-tabs .ant-tabs-tab:hover {
          color: #2563eb !important;
        }

        .notification-premium-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #2563eb !important;
          font-weight: 700 !important;
        }

        .notification-premium-tabs .ant-tabs-ink-bar {
          background: linear-gradient(90deg, #2563eb, #7c3aed) !important;
          height: 3px !important;
          border-radius: 999px !important;
        }

        .notification-premium-tabs .ant-card-body,
        .ant-card-body {
          padding: 28px !important;
        }

        .notification-premium-tabs .ant-form-item-label label {
          font-weight: 600;
          color: #374151;
        }

        .notification-select .ant-select-selector {
          border-radius: 16px !important;
          min-height: 48px !important;
          display: flex !important;
          align-items: center !important;
        }

        .ant-upload-wrapper .ant-upload-drag {
          border-radius: 18px !important;
        }
      `}</style>
    </Layout>
  );
}

const StatCard = ({ icon, label, value, helper, color = "blue" }) => {
  const theme = statThemes[color] || statThemes.blue;

  return (
    <div
      className={`rounded-[24px] border bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${theme.border} ${theme.glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>
          <div className="text-3xl font-black leading-none text-slate-900">
            {value || 0}
          </div>
          <div className="mt-3 text-sm text-slate-500">{helper}</div>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${theme.iconBg} ${theme.iconText}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Notification;