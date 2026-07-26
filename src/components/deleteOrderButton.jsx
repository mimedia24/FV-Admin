import { useState } from "react";
import { Button, Popconfirm, Tooltip, message } from "antd";
import { Trash2 } from "lucide-react";
import handleApiRequest from "../helpers/handleApiRequest";

const canMoveToTrash = (status) => {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();
  return normalized.includes("cancel") || normalized.includes("cencel");
};

export default function DeleteOrderButton({ order, getOrders }) {
  const [loading, setLoading] = useState(false);
  const allowed = canMoveToTrash(order?.status);

  const moveToTrash = async () => {
    try {
      setLoading(true);
      const { result } = await handleApiRequest(
        `/admin/order/delete-order?id=${order._id}`,
        {
          method: "DELETE",
          body: JSON.stringify({
            reason: "Moved to Trash from Main Admin Order Management",
          }),
        },
      );

      if (!result?.success) {
        throw new Error(result?.message || "Failed to move order to Trash.");
      }

      message.success(result?.message || "Order moved to Trash.");
      await getOrders();
    } catch (error) {
      message.error(error?.message || "Failed to move order to Trash.");
    } finally {
      setLoading(false);
    }
  };

  const button = (
    <Button
      danger
      size="small"
      icon={<Trash2 size={14} />}
      disabled={!allowed}
      loading={loading}
    >
      Trash
    </Button>
  );

  if (!allowed) {
    return (
      <Tooltip title="Cancel the order first. Active orders cannot be moved to Trash.">
        <span>{button}</span>
      </Tooltip>
    );
  }

  return (
    <Popconfirm
      title="Move this order to Trash?"
      description="It will no longer appear in active orders, but can be restored later."
      onConfirm={moveToTrash}
      okText="Move to Trash"
      cancelText="Keep order"
    >
      {button}
    </Popconfirm>
  );
}
