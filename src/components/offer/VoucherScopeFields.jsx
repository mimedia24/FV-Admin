import React, { useEffect, useMemo, useState } from "react";
import { Alert, Form, Select, Spin } from "antd";
import axiosInstance from "../../services/axios/axiosInstance";

const ids = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item?._id || item)).filter(Boolean);
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
};

export default function VoucherScopeFields({ form, visible }) {
  const [zones, setZones] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const anyRestaurant = Form.useWatch("anyRestaurant", form);
  const anyMenus = Form.useWatch("anyMenus", form);
  const selectedRestaurants = Form.useWatch("applicableRestaurants", form) || [];

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
      if (active) {
        setZones([]);
        setRestaurants([]);
      }
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [visible]);

  useEffect(() => {
    if (!visible || anyMenus || !selectedRestaurants.length) {
      setMenus([]);
      return;
    }
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

  const restaurantOptions = useMemo(() => restaurants.map((restaurant) => ({
    value: String(restaurant._id),
    label: `${restaurant.name}${restaurant.zoneId ? ` · Zone ${restaurant.zoneId}` : ""}`,
  })), [restaurants]);

  return (
    <Spin spinning={loading}>
      <Alert className="mb-4" type="info" showIcon message="Select by name — IDs are saved automatically." />
      <Form.Item name="applicableZones" label="Available Zones">
        <Select mode="multiple" allowClear showSearch optionFilterProp="label" placeholder="Select one or more zones"
          options={zones.map((zone) => ({ value: Number(zone.id ?? zone.zoneId), label: zone.name || zone.zoneName || `Zone ${zone.id ?? zone.zoneId}` }))} />
      </Form.Item>
      <Form.Item name="applicableRestaurants" label="Restaurants">
        <Select mode="multiple" allowClear showSearch optionFilterProp="label" disabled={anyRestaurant}
          placeholder={anyRestaurant ? "Available at every restaurant" : "Search and select restaurants"}
          options={restaurantOptions} />
      </Form.Item>
      <Form.Item name="applicableMenus" label="Menus">
        <Select mode="multiple" allowClear showSearch optionFilterProp="label" loading={menuLoading} disabled={anyMenus || !selectedRestaurants.length}
          placeholder={anyMenus ? "Available for every menu" : selectedRestaurants.length ? "Search and select menus" : "Select restaurant first"}
          options={menus.map((menu) => ({ value: String(menu._id), label: menu.name }))} />
      </Form.Item>
    </Spin>
  );
}

export { ids as normalizeScopeIds };
