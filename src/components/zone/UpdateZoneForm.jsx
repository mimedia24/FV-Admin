import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  message,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../services/axios/axiosInstance";

const { Text, Title } = Typography;

const UpdateZoneForm = ({ visible, onCancel, onSuccess, zoneData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (visible && zoneData) {
      // Logic to ensure isActive is a strict boolean for the Switch

      form.setFieldsValue({
        name: zoneData.name,
        isActive: isActive,
        points: zoneData.polygon,
      });

      setIsActive(zoneData.isActive);
    }
  }, [visible, zoneData, form]);

  const onFinish = async (values) => {
    // values.isActive will now correctly be true/false thanks to valuePropName="checked"
    const { name, points, isActive } = values;

    if (!points || points.length < 3) {
      return message.error("Zones must have at least 3 points.");
    }

    setLoading(true);
    try {
      const payload = {
        name,
        isActive: !!isActive, // Force to boolean
        points: points.map((p) => ({
          latitude: Number(p.latitude),
          longitude: Number(p.longitude),
        })),
      };

      // Sending PUT request to your backend controller
      await axiosInstance.put(
        `/v3/master-admin/zone/update/${zoneData.id}`,
        payload,
      );

      message.success("Zone architecture updated!");
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
            <EditOutlined className="text-amber-500 text-xl" />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, color: "#fff" }}>
              Update Zone
            </Title>
            <Text className="text-gray-500 text-[10px] uppercase tracking-widest">
              Editing ID: {zoneData?.id}
            </Text>
          </div>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      className="modern-dark-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-6"
        autoComplete="off"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Zone Name */}
          <Form.Item
            name="name"
            label={
              <Text className="text-gray-400 font-bold text-xs">ZONE NAME</Text>
            }
            rules={[{ required: true, message: "Name is required" }]}
            className="flex-1"
          >
            <Input
              placeholder="Enter zone name..."
              className="custom-dark-input h-12 rounded-xl"
            />
          </Form.Item>

          {/* CRITICAL FIX: valuePropName="checked" tells AntD to use the 'checked' prop of Switch */}
          <Form.Item
            name="isActive"
            label={
              <Text className="text-gray-400 font-bold text-xs">STATUS</Text>
            }
            valuePropName="checked"
          >
            <div className="h-12 flex items-center bg-gray-900/50 px-4 rounded-xl border border-gray-800 transition-all">
              <Switch
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<StopOutlined />}
                className="bg-gray-700"
                value={isActive}
                onChange={() => setIsActive(!isActive)}
              />
              <Text
                className={`ml-3 text-[10px] uppercase font-black tracking-tight w-14 ${isActive ? "text-amber-500" : "text-gray-500"}`}
              >
                {isActive ? "Active" : "Disabled"}
              </Text>
            </div>
          </Form.Item>
        </div>

        <Divider orientation="left">
          <Text className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
            Boundary Points
          </Text>
        </Divider>

        <Form.List name="points">
          {(fields, { add, remove }) => (
            <div className="flex flex-col gap-3">
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="flex gap-3 mb-3 items-start bg-gray-900/40 p-3 rounded-xl border border-gray-800 group hover:border-amber-500/30 transition-all"
                  >
                    <div className="mt-2 w-6 h-6 rounded-full bg-gray-800 text-gray-500 flex items-center justify-center text-[10px] font-bold group-hover:bg-amber-500/10 group-hover:text-amber-500">
                      {index + 1}
                    </div>
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <Form.Item
                        {...restField}
                        name={[name, "latitude"]}
                        rules={[{ required: true }]}
                        noStyle
                      >
                        <Input
                          placeholder="Lat"
                          type="number"
                          step="any"
                          className="custom-dark-input bg-transparent rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "longitude"]}
                        rules={[{ required: true }]}
                        noStyle
                      >
                        <Input
                          placeholder="Lng"
                          type="number"
                          step="any"
                          className="custom-dark-input bg-transparent rounded-lg"
                        />
                      </Form.Item>
                    </div>
                    {fields.length > 3 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        className="opacity-50 hover:opacity-100 mt-1"
                      />
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                className="h-12 border-gray-800 text-gray-400 hover:text-amber-500 rounded-xl bg-gray-900/20"
              >
                Add Vertex
              </Button>
            </div>
          )}
        </Form.List>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            onClick={onCancel}
            icon={<CloseOutlined />}
            className="bg-transparent border-gray-700 text-gray-400 hover:text-white rounded-xl h-11 px-6"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            className="bg-amber-600 hover:bg-amber-500 border-none rounded-xl h-11 px-8 font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            Update Perimeter
          </Button>
        </div>
      </Form>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .modern-dark-modal .ant-modal-content { background: #0b0f1a !important; border: 1px solid #1f2937; border-radius: 24px; padding: 24px; }
        .custom-dark-input { background-color: #111827 !important; border: 1px solid #1f2937 !important; color: #ffffff !important; transition: all 0.3s !important; }
        .custom-dark-input:focus { border-color: #f59e0b !important; background-color: #030712 !important; }

        /* Autofill Fix */
        input:-webkit-autofill {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px #111827 inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 10px; }
        .ant-switch-checked { background-color: #d97706 !important; }
      `,
        }}
      />
    </Modal>
  );
};

export default UpdateZoneForm;
