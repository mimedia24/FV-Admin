import { Select } from "antd";
import handleApiRequest from "../../helpers/handleApiRequest";
import { toast } from "react-toastify";

export default function ChangeStatus({ menu, setStatus }) {
  const handleChange = async (value) => {
    console.log(`selected ${value}`);

    const { result } = await handleApiRequest(
      `/admin/menu/change-menu-status?id=${menu._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          status: value,
        }),
      }
    );

    console.log(result);

    if (result?.success) {
      toast(result?.message);
      setStatus(result?.status);
    }
  };

  return (
    <Select
      defaultValue={menu.status}
      style={{ width: 120 }}
      onChange={handleChange}
      options={[
        { value: "in stock", label: "in stock" },
        { value: "out of stock", label: "out of stock" },
        { value: "discontinued", label: "discontinued" },
      ]}
    />
  );
}
