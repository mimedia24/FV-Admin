import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Form, Select, Spin } from "antd";
import { CircleMarker, MapContainer, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axiosInstance from "../../services/axios/axiosInstance";

const ids = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item?._id || item)).filter(Boolean);
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
};

const normalizePoint = (point) => ({
  latitude: Number(point?.latitude ?? point?.lat),
  longitude: Number(point?.longitude ?? point?.lng ?? point?.long),
});

function MapClick({ onAdd }) {
  useMapEvents({ click: ({ latlng }) => onAdd({ latitude: Number(latlng.lat.toFixed(6)), longitude: Number(latlng.lng.toFixed(6)) }) });
  return null;
}

function FitZone({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 3) map.fitBounds(L.latLngBounds(points.map((p) => [p.latitude, p.longitude])), { padding: [20, 20] });
  }, [map, points]);
  return null;
}

export default function VoucherScopeFields({ form, visible }) {
  const [zones, setZones] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const anyRestaurant = Form.useWatch("anyRestaurant", form);
  const anyMenus = Form.useWatch("anyMenus", form);
  const selectedRestaurants = Form.useWatch("applicableRestaurants", form) || [];
  const geoScopeMode = Form.useWatch("geoScopeMode", form) || "GLOBAL";
  const geoZoneId = Form.useWatch("geoZoneId", form);
  const geoPolygon = Form.useWatch("geoPolygon", form) || [];

  useEffect(() => {
    if (!visible) return;
    let active = true;
    setLoading(true);
    Promise.all([
      axiosInstance.get("/v3/app/user/zone-list"),
      axiosInstance.get("/admin/list-of-restaurants", { params: { page: 1, limit: 1000 } }),
    ]).then(([zoneResponse, restaurantResponse]) => {
      if (!active) return;
      setZones(zoneResponse.data?.result?.data || zoneResponse.data?.data || []);
      setRestaurants(restaurantResponse.data?.restaurants || []);
    }).catch(() => {
      if (active) { setZones([]); setRestaurants([]); }
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [visible]);

  useEffect(() => {
    if (!visible || anyMenus || !selectedRestaurants.length) { setMenus([]); return; }
    let active = true;
    setMenuLoading(true);
    Promise.all(selectedRestaurants.map((restaurantId) =>
      axiosInstance.get("/admin/restaurant-menu-list", { params: { id: restaurantId, page: 1, limit: 1000 } })
    )).then((responses) => {
      if (!active) return;
      const merged = responses.flatMap((response) => response.data?.menu || []);
      setMenus([...new Map(merged.map((menu) => [String(menu._id), menu])).values()]);
    }).catch(() => active && setMenus([])).finally(() => active && setMenuLoading(false));
    return () => { active = false; };
  }, [visible, anyMenus, selectedRestaurants.join(",")]);

  const zoneOptions = useMemo(() => zones.map((zone) => ({
    value: Number(zone.id ?? zone.zoneId),
    label: zone.name || zone.zoneName || `Zone ${zone.id ?? zone.zoneId}`,
  })), [zones]);
  const restaurantOptions = useMemo(() => restaurants.map((restaurant) => ({
    value: String(restaurant._id),
    label: `${restaurant.name}${restaurant.zoneId ? ` · Zone ${restaurant.zoneId}` : ""}`,
  })), [restaurants]);
  const selectedGeoZone = zones.find((zone) => Number(zone.id ?? zone.zoneId) === Number(geoZoneId));
  const zonePolygon = (selectedGeoZone?.polygon || []).map(normalizePoint).filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude));

  return (
    <Spin spinning={loading}>
      <Alert className="mb-4" type="info" showIcon message="Select scope by name; IDs and coordinates are saved automatically." />
      <Form.Item name="geoScopeMode" label="Location Availability" rules={[{ required: true }]}>
        <Select options={[
          { value: "GLOBAL", label: "All areas" },
          { value: "ZONE", label: "Selected zones" },
          { value: "POLYGON", label: "Draw an area inside one zone" },
        ]} onChange={(mode) => {
          if (mode === "GLOBAL") form.setFieldsValue({ applicableZones: [], geoZoneId: null, geoPolygon: [] });
          if (mode === "ZONE") form.setFieldsValue({ geoZoneId: null, geoPolygon: [] });
          if (mode === "POLYGON") form.setFieldsValue({ applicableZones: [], geoPolygon: [] });
        }} />
      </Form.Item>
      {geoScopeMode === "ZONE" && <Form.Item name="applicableZones" label="Available Zones" rules={[{ required: true, message: "Select at least one zone" }]}>
        <Select mode="multiple" allowClear showSearch optionFilterProp="label" placeholder="Select one or more zones" options={zoneOptions} />
      </Form.Item>}
      {geoScopeMode === "POLYGON" && <>
        <Form.Item name="geoZoneId" label="Polygon Zone" rules={[{ required: true, message: "Select a zone" }]}>
          <Select showSearch optionFilterProp="label" placeholder="Select zone first" options={zoneOptions} onChange={() => form.setFieldValue("geoPolygon", [])} />
        </Form.Item>
        <Form.Item name="geoPolygon" hidden><input /></Form.Item>
        {selectedGeoZone && <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">Click inside the zone to draw the campaign area ({geoPolygon.length} points)</span>
            <div className="flex gap-2"><Button size="small" disabled={!geoPolygon.length} onClick={() => form.setFieldValue("geoPolygon", geoPolygon.slice(0, -1))}>Undo</Button><Button size="small" danger disabled={!geoPolygon.length} onClick={() => form.setFieldValue("geoPolygon", [])}>Clear</Button></div>
          </div>
          <MapContainer center={[23.8103, 90.4125]} zoom={12} className="h-[360px] w-full">
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitZone points={zonePolygon} />
            <MapClick onAdd={(point) => form.setFieldValue("geoPolygon", [...geoPolygon, point])} />
            {zonePolygon.length >= 3 && <Polygon positions={zonePolygon.map((p) => [p.latitude, p.longitude])} pathOptions={{ color: "#64748b", weight: 2, fillOpacity: 0.08 }} />}
            {geoPolygon.length >= 3 && <Polygon positions={geoPolygon.map((p) => [p.latitude, p.longitude])} pathOptions={{ color: "#7c3aed", weight: 3, fillOpacity: 0.25 }} />}
            {geoPolygon.map((point, index) => <CircleMarker key={`${point.latitude}-${point.longitude}-${index}`} center={[point.latitude, point.longitude]} radius={6} pathOptions={{ color: "#7c3aed", fillOpacity: 1 }} />)}
          </MapContainer>
        </div>}
      </>}
      <Form.Item name="applicableRestaurants" label="Restaurants">
        <Select mode="multiple" allowClear showSearch optionFilterProp="label" disabled={anyRestaurant} placeholder={anyRestaurant ? "Available at every restaurant" : "Search and select restaurants"} options={restaurantOptions} />
      </Form.Item>
      <Form.Item name="applicableMenus" label="Menus">
        <Select mode="multiple" allowClear showSearch optionFilterProp="label" loading={menuLoading} disabled={anyMenus || !selectedRestaurants.length} placeholder={anyMenus ? "Available for every menu" : selectedRestaurants.length ? "Search and select menus" : "Select restaurant first"} options={menus.map((menu) => ({ value: String(menu._id), label: menu.name }))} />
      </Form.Item>
    </Spin>
  );
}

export { ids as normalizeScopeIds };
