import { Select } from "antd";
import handleApiRequest from "../helpers/handleApiRequest";

export default function SortOrdersList({ sort = "all", setOrders }) {
  const handleChange = async (value) => {
    console.log(`selected ${value}`);

    if (value === "all") {
      const { result } = await handleApiRequest(`/admin/list-of-orders`, {});

      console.log(result);
      if (result) {
        setOrders(result.orders);
      }
      return;
    }
    const { result } = await handleApiRequest(
      `/admin/filter-list-of-orders?filter=${value}&limit=10&page=1`,
      {}
    );
    if (result) {
      setOrders(result.orders);
    }
  };

  return (
    <Select
      defaultValue={sort}
      style={{
        width: 180,
      }}
      onChange={handleChange}
      options={[
        {
          value: "all",
          label: "all",
        },
        {
          value: "pending",
          label: "pending",
        },
        {
          value: "delivered",
          label: "delivered",
        },
        {
          value: "accept by rider",
          label: "accept by rider",
        },
        {
          value: "ready for cickup",
          label: "ready for cickup",
        },
        {
          value: "picked up",
          label: "picked up",
        },
        {
          value: "cancelled by restaurant",
          label: "cancelled by restaurant",
        },
        {
          value: "cencelled",
          label: "cencelled",
        },
      ]}
    />
  );
}
