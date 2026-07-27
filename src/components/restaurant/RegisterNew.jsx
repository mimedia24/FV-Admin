import React, { useEffect, useMemo, useRef, useState } from "react";
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
  ImagePlus,
  Plus,
} from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../config/maps";

import { apiPath, apiAuthToken } from "../../../secrets";

const { Text } = Typography;
const { TextArea } = Input;

const defaultCenter = {
  lat: 22.863161,
  lng: 91.097015,
};

const mapContainerStyle = {
  width: "100%",
  height: "280px",
};

function isValidLatitude(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= -90 && number <= 90;
}

function isValidLongitude(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= -180 && number <= 180;
}

function getLat(value) {
  if (!value) return null;

  if (Array.isArray(value)) {
    const first = Number(value[0]);
    const second = Number(value[1]);

    if (isValidLongitude(first) && isValidLatitude(second)) return second;
    if (isValidLatitude(first) && isValidLongitude(second)) return first;
  }

  const direct =
    value.latitude ??
    value.lat ??
    value.Latitude ??
    value.Lat;

  return isValidLatitude(direct) ? Number(direct) : null;
}

function getLng(value) {
  if (!value) return null;

  if (Array.isArray(value)) {
    const first = Number(value[0]);
    const second = Number(value[1]);

    if (isValidLongitude(first) && isValidLatitude(second)) return first;
    if (isValidLatitude(first) && isValidLongitude(second)) return second;
  }

  const direct =
    value.longitude ??
    value.lng ??
    value.long ??
    value.lon ??
    value.Longitude ??
    value.Lng ??
    value.Long;

  return isValidLongitude(direct) ? Number(direct) : null;
}

function normalizePoint(point) {
  const latitude = getLat(point);
  const longitude = getLng(point);

  if (latitude === null || longitude === null) return null;

  return {
    latitude,
    longitude,
  };
}

function normalizePolygon(polygon) {
  if (!polygon) return [];

  if (
    typeof polygon === "object" &&
    !Array.isArray(polygon) &&
    Array.isArray(polygon.coordinates)
  ) {
    return normalizePolygon(polygon.coordinates);
  }

  if (!Array.isArray(polygon)) return [];

  if (
    Array.isArray(polygon[0]) &&
    Array.isArray(polygon[0][0]) &&
    Array.isArray(polygon[0][0][0])
  ) {
    return normalizePolygon(polygon[0][0]);
  }

  if (
    Array.isArray(polygon[0]) &&
    Array.isArray(polygon[0][0])
  ) {
    return normalizePolygon(polygon[0]);
  }

  return polygon.map(normalizePoint).filter(Boolean);
}

function getDistanceFromPointToSegment(point, segmentStart, segmentEnd) {
  const x = point.longitude;
  const y = point.latitude;
  const x1 = segmentStart.longitude;
  const y1 = segmentStart.latitude;
  const x2 = segmentEnd.longitude;
  const y2 = segmentEnd.latitude;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return Math.hypot(x - x1, y - y1);
  }

  const t = Math.max(
    0,
    Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy))
  );

  const projectionX = x1 + t * dx;
  const projectionY = y1 + t * dy;

  return Math.hypot(x - projectionX, y - projectionY);
}

function isPointOnPolygonBoundary(point, polygon) {
  const normalizedPoint = normalizePoint(point);
  const normalizedPolygon = normalizePolygon(polygon);

  if (!normalizedPoint || normalizedPolygon.length < 2) return false;

  const boundaryTolerance = 0.000001;

  for (let i = 0; i < normalizedPolygon.length; i += 1) {
    const current = normalizedPolygon[i];
    const next = normalizedPolygon[(i + 1) % normalizedPolygon.length];

    const distance = getDistanceFromPointToSegment(
      normalizedPoint,
      current,
      next
    );

    if (distance <= boundaryTolerance) return true;
  }

  return false;
}

function isPointInPolygon(point, polygon) {
  const userPoint = normalizePoint(point);
  const normalizedPolygon = normalizePolygon(polygon);

  if (!userPoint || normalizedPolygon.length < 3) return false;

  if (isPointOnPolygonBoundary(userPoint, normalizedPolygon)) {
    return true;
  }

  const x = userPoint.longitude;
  const y = userPoint.latitude;

  let inside = false;

  for (
    let i = 0, j = normalizedPolygon.length - 1;
    i < normalizedPolygon.length;
    j = i++
  ) {
    const xi = normalizedPolygon[i].longitude;
    const yi = normalizedPolygon[i].latitude;
    const xj = normalizedPolygon[j].longitude;
    const yj = normalizedPolygon[j].latitude;

    const intersects =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi || Number.EPSILON) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
}

function getZoneId(zone) {
  return (
    zone?.id ??
    zone?.zoneId ??
    zone?.zone_id ??
    zone?.value ??
    zone?._id ??
    null
  );
}

function getZoneMongoId(zone) {
  return zone?._id ?? null;
}

function getZoneName(zone) {
  return (
    zone?.name ||
    zone?.zoneName ||
    zone?.zone_name ||
    zone?.title ||
    "Delivery Zone"
  );
}

function getZonePolygon(zone) {
  return (
    zone?.polygom ||
    zone?.polygon ||
    zone?.polygons ||
    zone?.coordinates ||
    zone?.location?.coordinates ||
    zone?.geometry?.coordinates ||
    zone?.boundary ||
    zone?.boundaries ||
    zone?.area ||
    zone?.points ||
    []
  );
}

function isZoneActive(zone) {
  const status = String(zone?.status || zone?.zoneStatus || "").toLowerCase();

  if (
    zone?.isActive === false ||
    zone?.active === false ||
    zone?.isDeleted === true ||
    zone?.deleted === true
  ) {
    return false;
  }

  if (status && ["inactive", "disabled", "blocked", "deleted"].includes(status)) {
    return false;
  }

  return true;
}

function normalizeZone(zone) {
  if (!zone) return null;

  const zoneId = getZoneId(zone);
  const zoneMongoId = getZoneMongoId(zone);
  const zoneName = getZoneName(zone);
  const polygon = getZonePolygon(zone);

  if (!zoneId && !zoneMongoId) return null;

  return {
    ...zone,
    id: zone?.id ?? zoneId,
    _id: zoneMongoId ?? zone?._id,
    zoneId,
    selectedZoneId: zoneId,
    zoneMongoId,
    zoneName,
    name: zone?.name || zoneName,
    polygon,
  };
}

function extractActiveZones(payload) {
  const zoneList =
    payload?.activeZone ||
    payload?.resource?.activeZone ||
    payload?.result?.activeZone ||
    payload?.result?.data ||
    payload?.data?.activeZone ||
    payload?.data?.data ||
    payload?.data?.zones ||
    payload?.result?.zones ||
    payload?.zones ||
    payload?.zoneList ||
    payload?.data ||
    payload?.resource ||
    [];

  if (!Array.isArray(zoneList)) return [];

  return zoneList.map(normalizeZone).filter(Boolean).filter(isZoneActive);
}

function RegisterNewRestaurant({ visible, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const mapRef = useRef(null);
  const zonesRef = useRef([]);
  const lastLocationRef = useRef({
    lat: null,
    lng: null,
  });
  const zoneRequestDoneRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [pickedLocation, setPickedLocation] = useState(defaultCenter);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const mapCenter = useMemo(() => {
    return {
      lat: Number(pickedLocation.lat),
      lng: Number(pickedLocation.lng),
    };
  }, [pickedLocation]);

  const calculateAndSetZone = (lat, lng, zoneList = zonesRef.current) => {
    const matchedZone = (zoneList || []).find((zone) => {
      const polygon = getZonePolygon(zone);
      return isPointInPolygon({ latitude: lat, longitude: lng }, polygon);
    });

    if (matchedZone) {
      const zoneId = getZoneId(matchedZone);
      const zoneName = getZoneName(matchedZone);

      const finalZone = {
        ...matchedZone,
        zoneId,
        selectedZoneId: zoneId,
        zoneName,
        polygon: normalizePolygon(getZonePolygon(matchedZone)),
      };

      setSelectedZone(finalZone);

      form.setFieldsValue({
        zoneId,
        zoneName,
      });

      return finalZone;
    }

    setSelectedZone(null);

    form.setFieldsValue({
      zoneId: "",
      zoneName: "",
    });

    return null;
  };

  const refreshZoneListOnce = async () => {
    if (zoneRequestDoneRef.current) {
      return zonesRef.current;
    }

    zoneRequestDoneRef.current = true;
    setZoneLoading(true);

    try {
      const { data } = await axios.get(`${apiPath}/v3/app/user/zone-list`, {
        headers: {
          "x-auth-token": apiAuthToken,
        },
      });

      const zoneList = extractActiveZones(data);

      zonesRef.current = zoneList;
      setZones(zoneList);

      console.log("Admin zones loaded once:", zoneList);

      return zoneList;
    } catch (error) {
      console.log("Admin zone-list failed:", error?.response?.data || error);

      zonesRef.current = [];
      setZones([]);

      return [];
    } finally {
      setZoneLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) return;

    let isMounted = true;

    const init = async () => {
      const lat = Number(defaultCenter.lat);
      const lng = Number(defaultCenter.lng);

      lastLocationRef.current = {
        lat,
        lng,
      };

      setPickedLocation({ lat, lng });

      form.setFieldsValue({
        lat,
        long: lng,
        zoneId: "",
        zoneName: "",
      });

      const zoneList = await refreshZoneListOnce();

      if (!isMounted) return;

      calculateAndSetZone(lat, lng, zoneList);

      setTimeout(() => {
        if (mapRef.current && window.google) {
          window.google.maps.event.trigger(mapRef.current, "resize");
          mapRef.current.setCenter({ lat, lng });
        }
      }, 500);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [visible]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  const updateLocationFromMapCenter = () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();

    if (!center) return;

    const lat = Number(center.lat().toFixed(7));
    const lng = Number(center.lng().toFixed(7));

    if (
      lastLocationRef.current.lat === lat &&
      lastLocationRef.current.lng === lng
    ) {
      return;
    }

    lastLocationRef.current = {
      lat,
      lng,
    };

    setPickedLocation({ lat, lng });

    form.setFieldsValue({
      lat,
      long: lng,
    });

    calculateAndSetZone(lat, lng, zonesRef.current);
  };

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

  const resetModal = () => {
    form.resetFields();
    setImageUrl(null);
    setFileList([]);
    setPickedLocation(defaultCenter);
    setSelectedZone(null);

    lastLocationRef.current = {
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
    };

    form.setFieldsValue({
      lat: defaultCenter.lat,
      long: defaultCenter.lng,
      zoneId: "",
      zoneName: "",
    });
  };

  const handleClose = () => {
    resetModal();
    onCancel();
  };

  const onFinish = async (values) => {
    if (fileList.length === 0) {
      return toast.error("Restaurant image is required!");
    }

    const lat = Number(values.lat || pickedLocation.lat);
    const long = Number(values.long || pickedLocation.lng);

    const matchedZone =
      selectedZone || calculateAndSetZone(lat, long, zonesRef.current);

    if (!values.name || !String(values.name).trim()) {
      return toast.error("Restaurant name is required.");
    }

    if (!values.address || !String(values.address).trim()) {
      return toast.error("Address is required.");
    }

    if (!values.phone || !String(values.phone).trim()) {
      return toast.error("Phone number is required.");
    }

    if (!values.password || String(values.password).length < 6) {
      return toast.error("Minimum 6 character password required.");
    }

    if (!Number.isFinite(lat) || !Number.isFinite(long)) {
      return toast.error("Please set restaurant location from Google Map.");
    }

    if (!matchedZone) {
      return toast.error(
        "This restaurant location is outside delivery zone. Please select location inside Lakshmipur or Noakhali zone."
      );
    }

    if (!values.times || values.times.length !== 2) {
      return toast.error("Opening and closing time is required.");
    }

    const zoneId = getZoneId(matchedZone);
    const zoneMongoId = getZoneMongoId(matchedZone);
    const zoneName = getZoneName(matchedZone);

    if (!zoneId && !zoneMongoId) {
      return toast.error("Zone matched but zone id is missing.");
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("address", values.address);
    formData.append("description", values.description || "");
    formData.append("owner", values.owner || "");
    formData.append("password", values.password);
    formData.append("phone", values.phone);
    formData.append("email", values.email || "");
    formData.append("lat", String(lat));
    formData.append("long", String(long));
    formData.append("openingTime", values.times[0].format("HH:mm"));
    formData.append("closingTime", values.times[1].format("HH:mm"));
    formData.append("image", fileList[0].originFileObj);

    formData.append("zoneId", String(zoneId || zoneMongoId));
    formData.append("selectedZoneId", String(zoneId || zoneMongoId));
    formData.append("activeZoneId", String(zoneId || zoneMongoId));
    formData.append("finalZoneId", String(zoneId || zoneMongoId));
    formData.append("zoneMongoId", String(zoneMongoId || ""));
    formData.append("zoneName", zoneName || "");

    formData.append(
      "restaurantCoordinator",
      JSON.stringify({
        type: "Point",
        coordinates: [long, lat],
      })
    );

    formData.append(
      "location",
      JSON.stringify({
        type: "Point",
        coordinates: [long, lat],
        latitude: lat,
        longitude: long,
        address: values.address,
        zoneId: zoneId || zoneMongoId,
        zoneName,
      })
    );

    try {
      const { data } = await axios.post(
        `${apiPath}/v2/restaurant/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success(
          data.message ||
            `Restaurant registered successfully in ${zoneName || "zone"}.`
        );

        resetModal();

        if (typeof onSuccess === "function") {
          onSuccess();
        }

        onCancel();
      } else {
        toast.error(data?.message || "Restaurant registration failed.");
      }
    } catch (error) {
      console.log("Restaurant registration error:", error?.response || error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.msg ||
        "Registration failed.";

      toast.error(message);
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
      onCancel={handleClose}
      footer={null}
      width={900}
      centered
      className="modern-modal"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-4"
        requiredMark={false}
        initialValues={{
          lat: defaultCenter.lat,
          long: defaultCenter.lng,
          zoneId: "",
          zoneName: "",
        }}
      >
        <Row gutter={24}>
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
                    alt="restaurant"
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

          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Restaurant Name
                </Text>
              }
              name="name"
              rules={[{ required: true, message: "Restaurant name required" }]}
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
            >
              <Input
                prefix={<User size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="John Doe"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Email Address
                </Text>
              }
              name="email"
              rules={[{ type: "email", message: "Valid email required" }]}
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
              rules={[{ required: true, message: "Phone required" }]}
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
              rules={[
                {
                  required: true,
                  min: 6,
                  message: "Minimum 6 characters",
                },
              ]}
            >
              <Input.Password
                prefix={<Lock size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="••••••••"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Full Address
                </Text>
              }
              name="address"
              rules={[{ required: true, message: "Address required" }]}
            >
              <Input
                prefix={<MapPin size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="Write restaurant address manually"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="m-0 text-xs font-black uppercase tracking-wider text-slate-600">
                    Pick Restaurant Location
                  </p>

                  <p className="m-0 text-[11px] font-semibold text-slate-400">
                    Same zone detection logic as website address picker.
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600">
                    {pickedLocation.lat}, {pickedLocation.lng}
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-[11px] font-black ${
                      selectedZone
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {zoneLoading
                      ? "Checking zones..."
                      : selectedZone
                      ? `Zone: ${getZoneName(selectedZone)}`
                      : "No zone matched"}
                  </div>
                </div>
              </div>

              <div className="relative h-[280px] w-full">
                {loadError ? (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-red-500">
                    Google Map failed to load. Check API key.
                  </div>
                ) : isLoaded ? (
                  <>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={16}
                      onLoad={handleMapLoad}
                      onIdle={updateLocationFromMapCenter}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                        gestureHandling: "greedy",
                      }}
                    />

                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
                      <MapPin
                        size={44}
                        fill="#ef4444"
                        color="#ef4444"
                        strokeWidth={2}
                        className="drop-shadow-lg"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-500">
                    Loading Google Map...
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Latitude
                </Text>
              }
              name="lat"
              rules={[{ required: true, message: "Latitude required" }]}
            >
              <Input
                readOnly
                prefix={<MapPin size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
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
              rules={[{ required: true, message: "Longitude required" }]}
            >
              <Input
                readOnly
                prefix={<MapPin size={16} className="text-slate-400" />}
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Zone ID
                </Text>
              }
              name="zoneId"
            >
              <Input
                readOnly
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="Auto detected"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Zone Name
                </Text>
              }
              name="zoneName"
            >
              <Input
                readOnly
                className="rounded-xl h-11 bg-slate-50 border-slate-100"
                placeholder="Auto detected"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={
                <Text className="text-xs font-bold text-slate-500 uppercase">
                  Operating Hours
                </Text>
              }
              name="times"
              rules={[
                {
                  required: true,
                  message: "Opening and closing time required",
                },
              ]}
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
            >
              <TextArea
                rows={3}
                className="rounded-xl bg-slate-50 border-slate-100"
                placeholder="Tell us about the cuisine or specialty..."
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleClose}
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

        .gm-style {
          font-family: inherit !important;
        }

        .ant-modal {
          max-width: calc(100vw - 24px);
        }
      `}</style>
    </Modal>
  );
}

export default RegisterNewRestaurant;
