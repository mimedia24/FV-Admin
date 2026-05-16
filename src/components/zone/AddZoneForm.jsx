import React, { useEffect, useMemo, useRef, useState } from "react";
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
  AimOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../services/axios/axiosInstance";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

const { Text, Title } = Typography;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultCenter = [23.8103, 90.4125];

function ClickHandler({ onAddPoint }) {
  useMapEvents({
    click(e) {
      onAddPoint({
        latitude: Number(e.latlng.lat.toFixed(6)),
        longitude: Number(e.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

function FlyToPolygon({ points }) {
  const map = useMapEvents({});

  useEffect(() => {
    if (!points?.length) return;

    const valid = points.filter(
      (p) =>
        p?.latitude !== "" &&
        p?.longitude !== "" &&
        !Number.isNaN(Number(p.latitude)) &&
        !Number.isNaN(Number(p.longitude))
    );

    if (valid.length === 1) {
      map.setView([Number(valid[0].latitude), Number(valid[0].longitude)], 14);
      return;
    }

    if (valid.length >= 2) {
      const bounds = L.latLngBounds(
        valid.map((p) => [Number(p.latitude), Number(p.longitude)])
      );
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [points, map]);

  return null;
}

const AddZoneForm = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  const watchedPoints = Form.useWatch("points", form) || [{}, {}, {}];

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        points: [{}, {}, {}],
      });
    }
  }, [visible, form]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const validPoints = useMemo(() => {
    return (watchedPoints || []).filter(
      (p) =>
        p &&
        p.latitude !== undefined &&
        p.longitude !== undefined &&
        p.latitude !== "" &&
        p.longitude !== "" &&
        !Number.isNaN(Number(p.latitude)) &&
        !Number.isNaN(Number(p.longitude))
    );
  }, [watchedPoints]);

  const polygonPositions = validPoints.map((p) => [
    Number(p.latitude),
    Number(p.longitude),
  ]);

  const handleMapAddPoint = (point) => {
  const current = form.getFieldValue("points") || [];

  const emptyIndex = current.findIndex(
    (p) =>
      !p ||
      p.latitude === undefined ||
      p.longitude === undefined ||
      p.latitude === "" ||
      p.longitude === ""
  );

  let updatedPoints = [...current];

  if (emptyIndex !== -1) {
    updatedPoints[emptyIndex] = point;
  } else {
    updatedPoints.push(point);
  }

  form.setFieldsValue({
    points: updatedPoints,
  });
};

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(defaultCenter, 12);
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  };

  const onFinish = async (values) => {
    const { name, points } = values;

    if (!points || points.length < 3) {
      return message.error(
        "A zone requires at least 3 coordinate points to form a perimeter."
      );
    }

    const cleanedPoints = points.filter(
      (p) =>
        p &&
        p.latitude !== undefined &&
        p.longitude !== undefined &&
        p.latitude !== "" &&
        p.longitude !== "" &&
        !Number.isNaN(Number(p.latitude)) &&
        !Number.isNaN(Number(p.longitude))
    );

    if (cleanedPoints.length < 3) {
      return message.error(
        "A zone requires at least 3 valid coordinate points."
      );
    }

    setLoading(true);
    try {
      const formattedPoints = cleanedPoints.map((p) => ({
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
      }));

      const payload = {
        name,
        points: formattedPoints,
        managerName: values.managerName,
        managerPhoneNumber: values.managerPhoneNumber,
        managerPassword: values.managerPassword,
      };

      const response = await axiosInstance.post(
        "/v3/master-admin/zone/create",
        payload
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
              Input precise coordinates or click on the map
            </Text>
          </div>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1050}
      centered
      destroyOnClose
      className="manual-zone-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-4"
        initialValues={{ points: [{}, {}, {}] }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.95fr] gap-6">
          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <Text strong>Interactive Map</Text>
                <div className="text-xs text-gray-500">
                  Click on the map to add perimeter points
                </div>
              </div>

              <Button
                icon={<AimOutlined />}
                onClick={handleResetView}
                className="rounded-xl"
              >
                Reset View
              </Button>
            </div>

            <div className="h-[470px] w-full">
              <MapContainer
                center={defaultCenter}
                zoom={12}
                scrollWheelZoom
                className="h-full w-full"
                whenReady={(e) => {
                  mapRef.current = e.target;
                  setTimeout(() => {
                    e.target.invalidateSize();
                  }, 300);
                }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ClickHandler onAddPoint={handleMapAddPoint} />
                <FlyToPolygon points={validPoints} />

                {validPoints.map((point, index) => (
                  <Marker
                    key={`${point.latitude}-${point.longitude}-${index}`}
                    position={[
                      Number(point.latitude),
                      Number(point.longitude),
                    ]}
                  />
                ))}

                {polygonPositions.length >= 3 && (
                  <Polygon
                    positions={polygonPositions}
                    pathOptions={{ color: "#4f46e5", weight: 3 }}
                  />
                )}
              </MapContainer>
            </div>
          </div>

          <div>
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
    Zone Manager Login
  </Text>
</Divider>

<Form.Item
  name="managerName"
  label={<Text strong>Manager Name</Text>}
  rules={[{ required: true, message: "Manager name is required" }]}
>
  <Input
    placeholder="e.g. MD Rahed"
    size="large"
    className="rounded-xl border-gray-200"
  />
</Form.Item>

<Form.Item
  name="managerPhoneNumber"
  label={<Text strong>Manager Login Phone Number</Text>}
  rules={[
    { required: true, message: "Manager phone number is required" },
    {
      pattern: /^01[0-9]{9}$/,
      message: "Phone number must be 11 digits and start with 01",
    },
  ]}
>
  <Input
    placeholder="e.g. 01575088264"
    size="large"
    maxLength={11}
    className="rounded-xl border-gray-200"
  />
</Form.Item>

<Form.Item
  name="managerPassword"
  label={<Text strong>Manager Password</Text>}
  rules={[
    { required: true, message: "Manager password is required" },
    { min: 6, message: "Password must be at least 6 characters" },
  ]}
>
  <Input.Password
    placeholder="Create login password"
    size="large"
    className="rounded-xl border-gray-200"
  />
</Form.Item>

<div className="bg-emerald-50 p-4 rounded-xl mb-5 border border-emerald-100 flex gap-3">
  <GlobalOutlined className="text-emerald-500 mt-1" />
  <Text className="text-[11px] text-emerald-700 leading-tight">
    This phone number and password will be used to login to the Agent Panel for this zone.
  </Text>
</div>

            <Divider orientation="left">
              <Text className="text-xs uppercase tracking-widest font-bold text-gray-400">
                Coordinate Points
              </Text>
            </Divider>

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
                You can now click on the map to add points automatically. Zones
                are calculated as closed polygons, so add points in sequence
                around the perimeter.
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
          </div>
        </div>
      </Form>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .manual-zone-modal .ant-modal-content {
          border-radius: 24px !important;
          padding: 24px !important;
        }

        .manual-zone-modal .leaflet-container {
          height: 100% !important;
          width: 100% !important;
          min-height: 470px !important;
          z-index: 1;
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