import React from "react";
import { Select, Space } from "antd";
import handleApiRequest from "../../helpers/handleApiRequest";

export default function FilterMenu({ setMenus }) {
  const handleChange = async (value) => {
    console.log(`selected ${value}`);

    if (value === "all") {
      const { loading, result } = await handleApiRequest(
        "/admin/list-of-menus",
        {
          method: "GET",
        }
      );
      if (result?.success) {
        setMenus(result.menus);
        return;
      }
    }

    const { loading, result } = await handleApiRequest(
      `/admin/menu/filter-menu`,
      {
        method: "POST",
        body: JSON.stringify({
          filter: value,
        }),
      }
    );

    if (result?.success) {
      setMenus(result.menus);
    }
  };
  return (
    <Select
      defaultValue="all"
      style={{ width: 160 }}
      onChange={handleChange}
      options={[
        { value: "all", label: "all" },
        { value: "in stock", label: "in stock" },
        { value: "out of stock", label: "out of stock" },
        { value: "discontinued", label: "discontinued" },
      ]}
    />
  );
}
