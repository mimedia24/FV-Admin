import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  TimePicker,
  Row,
  Col,
  Typography,
} from "antd";
import {
  Store,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Clock,
  ImagePlus,
  AlignLeft,
  Plus,
} from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import { apiAuthToken, apiPath } from "../../../secrets";

const { Text } = Typography;
const { TextArea } = Input;

function RegisterNewRestaurant({ visible, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Handle Image Selection
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      if (file) {
        setImageUrl(URL.createObjectURL(file));
      }
    } else {
      setImageUrl(null);
    }
  };

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      return toast.error("Restaurant image is required!");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", fileList[0].originFileObj);
    formData.append("name", values.name);
    formData.append("owner", values.owner);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("description", values.description);
    formData.append("lat", values.lat);
    formData.append("long", values.long);
    formData.append("openingTime", values.times[0].format("HH:mm"));
    formData.append("closingTime", values.times[1].format("HH:mm"));

    try {
      const { data } = await axios.post(
        `${apiPath}/restaurant/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": apiAuthToken,
          },
        },
      );

      if (data.success) {
        toast.success(data.message || "Restaurant Registered Successfully!");
        form.resetFields();
        setImageUrl(null);
        setFileList([]);
        onSuccess(); // Refresh the list
        onCancel(); // Close modal
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Store size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 m-0 leading-tight tracking-tight uppercase">
              Register Partner
            </h3>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Add New Foodverse Vendor
            </Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
      className="modern-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-4"
        requiredMark={false}
      >
        <Row gutter={24}>
          {/* Image Upload Section */}
          <Col span={24} className="flex justify-center mb-6">
            <div className="relative group">
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleChange}
                maxCount={1}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    {loading ? (
                      <LoadingOutlined />
                    ) : (
                      <ImagePlus size={32} strokeWidth={1.5} />
                    )}
                    <div className="mt-2 text-[10px] font-bold uppercase">
                      Upload Image
                    </div>
                  </div>
                )}
              </Upload>
              {imageUrl && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-lg">
                  <Plus size={14} />
                </div>
              )}
            </div>
          </Col>

          {/* Basic Info */}
          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Restaurant Name
                </Text>
              }
              name="name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                prefix={<Store size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="Food Palace"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Owner Name
                </Text>
              }
              name="owner"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                prefix={<User size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="John Doe"
              />
            </Form.Item>
          </Col>

          {/* Contact Info */}
          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Email Address
                </Text>
              }
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Valid email required",
                },
              ]}
            >
              <Input
                prefix={<Mail size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="vendor@foodverse.com"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Phone Number
                </Text>
              }
              name="phone"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                prefix={<Phone size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="+8801XXXXXXX"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Login Password
                </Text>
              }
              name="password"
              rules={[{ required: true, min: 6, message: "Min 6 characters" }]}
            >
              <Input.Password
                prefix={<Lock size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="••••••••"
              />
            </Form.Item>
          </Col>

          {/* Location Details */}
          <Col span={24}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Full Address
                </Text>
              }
              name="address"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                prefix={<MapPin size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="12/A, Dhanmondi, Dhaka"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Latitude
                </Text>
              }
              name="lat"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                prefix={<MapPin size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="23.8103"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Longitude
                </Text>
              }
              name="long"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                prefix={<MapPin size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="90.4125"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Operating Hours (Open - Close)
                </Text>
              }
              name="times"
              rules={[{ required: true, message: "Required" }]}
            >
              <TimePicker.RangePicker
                format="HH:mm"
                className="w-full h-11 rounded-xl bg-slate-50 border-slate-100"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Short Description
                </Text>
              }
              name="description"
              rules={[{ required: true, message: "Required" }]}
            >
              <TextArea
                rows={3}
                prefix={<AlignLeft size={16} className="text-slate-400" />}
                className="rounded-xl bg-slate-50 border-slate-100"
                placeholder="Tell us about the cuisine or specialty..."
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={onCancel}
            className="flex-1 h-12 rounded-2xl font-bold text-slate-500 border-slate-200"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="flex-[2] h-12 rounded-2xl font-bold bg-blue-600 shadow-lg shadow-blue-200 border-none"
          >
            Create Partner Account
          </Button>
        </div>
      </Form>

      <style>{`
        .avatar-uploader .ant-upload.ant-upload-select-picture-card {
          width: 120px;
          height: 120px;
          border-radius: 2rem;
          background-color: #f8fafc;
          border: 2px dashed #e2e8f0;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .avatar-uploader .ant-upload.ant-upload-select-picture-card:hover {
          border-color: #2563eb;
          background-color: #eff6ff;
        }
      `}</style>
    </Modal>
  );
}

export default RegisterNewRestaurant;
