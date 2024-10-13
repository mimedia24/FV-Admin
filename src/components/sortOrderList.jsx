import { Select } from "antd";
import handleApiRequest from "../helpers/handleApiRequest";

export default function SortOrdersList({ sort = "all", setOrders }) {
  const handleChange = async (value) => {
    console.log(`selected ${value}`);

    if (value === "All") {
      const { result } = await handleApiRequest(`/admin/list-of-orders`, {});

      console.log(result);
      if (result) {
        setOrders(result);
      }
      return;
    }
    const { result } = await handleApiRequest(
      `/admin/filter-list-of-orders?filter=${value}&limit=10&page=1`,
      {}
    );
    if (result) {
      setOrders(result);
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
          value: "All",
          label: "All",
        },
        {
          value: "Pending",
          label: "Pending",
        },
        {
          value: "Delivered",
          label: "Delivered",
        },
        {
          value: "Accept By Rider",
          label: "Accept By Rider",
        },
        {
          value: "Ready for Pickup",
          label: "Ready for Pickup",
        },
        {
          value: "Picked Up",
          label: "Picked Up",
        },
        {
          value: "Cancelled by Restaurant",
          label: "Cancelled by Restaurant",
        },
        {
          value: "Cencelled",
          label: "Cencelled",
        },
      ]}
    />
  );
}
