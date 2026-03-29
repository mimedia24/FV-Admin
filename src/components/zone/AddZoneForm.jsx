import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  message,
  Card,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  GlobalOutlined,
  SaveOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import axios from "axios";
import axiosInstance from "../../services/axios/axiosInstance";

const { Text, Title } = Typography;

const AddZoneForm = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { name, points } = values;

    if (!points || points.length < 3) {
      return message.error(
        "A zone requires at least 3 coordinate points to form a perimeter.",
      );
    }

    setLoading(true);
    try {
      // Points come from the form as strings usually,
      // ensuring they are numbers before sending to your backend
      const formattedPoints = points.map((p) => ({
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
      }));

      const payload = {
        name,
        points: formattedPoints,
      };

      const response = await axiosInstance.post(
        "/v3/master-admin/zone/create",
        payload,
      );

      if (response.data) {
        message.success("Zone coordinates saved successfully!");
        form.resetFields();
        onSuccess();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to save zone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space className="py-2">
          <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center">
            <EnvironmentOutlined className="text-indigo-600 text-xl" />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Manual Zone Entry
            </Title>
            <Text type="secondary" className="text-xs">
              Input precise coordinates for the service perimeter
            </Text>
          </div>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
      className="manual-zone-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-4"
        initialValues={{ points: [{}, {}, {}] }} // Pre-fill with 3 empty points
      >
        <Form.Item
          name="name"
          label={<Text strong>Zone Identity Name</Text>}
          rules={[{ required: true, message: "Zone name is required" }]}
        >
          <Input
            placeholder="e.g. Sector 7 Boundary"
            size="large"
            className="rounded-xl border-gray-200"
          />
        </Form.Item>

        <Divider orientation="left">
          <Text className="text-xs uppercase tracking-widest font-bold text-gray-400">
            Coordinate Points
          </Text>
        </Divider>

        {/* Dynamic Point List */}
        <Form.List name="points">
          {(fields, { add, remove }) => (
            <div className="flex flex-col gap-3">
              <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    size="small"
                    className="mb-3 border-gray-100 shadow-sm rounded-xl bg-gray-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white border border-gray-200 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-400">
                        {index + 1}
                      </div>

                      <div className="grid grid-cols-2 gap-3 flex-1">
                        <Form.Item
                          {...restField}
                          name={[name, "latitude"]}
                          rules={[{ required: true, message: "Required" }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            className="rounded-lg"
                          />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, "longitude"]}
                          rules={[{ required: true, message: "Required" }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </div>

                      {fields.length > 3 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          className="hover:bg-red-50 rounded-lg"
                        />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                className="h-12 rounded-xl border-indigo-200 text-indigo-600 hover:border-indigo-400 hover:text-indigo-700 mt-2"
              >
                Add Vertex Point
              </Button>
            </div>
          )}
        </Form.List>

        <div className="bg-blue-50 p-4 rounded-xl mt-6 border border-blue-100 flex gap-3">
          <GlobalOutlined className="text-blue-500 mt-1" />
          <Text className="text-[11px] text-blue-700 leading-tight">
            Zones are calculated as closed polygons. Ensure your points are
            entered in sequential order around the perimeter to avoid coordinate
            overlap errors.
          </Text>
        </div>

        <div className="flex justify-end items-center gap-4 mt-8">
          <Button onClick={onCancel} type="text">
            Discard
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            className="h-12 px-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30 border-none font-bold"
          >
            Create Zone
          </Button>
        </div>
      </Form>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .manual-zone-modal .ant-modal-content {
          border-radius: 24px !important;
          padding: 24px !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `,
        }}
      />
    </Modal>
  );
};

export default AddZoneForm;
