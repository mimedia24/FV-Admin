import ChangeStatus from "./changeStatus";
import { useMemo, useState } from "react";
import AssignRiderModal from "./assignRiderModal";
import DeleteOrderButton from "./deleteOrderButton";
import convertDateAsLocalTime from "../helpers/timeStamp";
import ViewOrderItem from "./order/viewOrderItem";
import CopyIcon from "./common/CopyIcon";
import { Button, Tag } from "antd";
import Modal from "./order/Modal";
import TimelineContainer from "./order/TimelineContainer";
import { Link } from "react-router-dom";

const toNumber = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (value) =>
  `BDT ${toNumber(value).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;

function normalizeStatus(status) {
  return String(status || "pending").trim().toLowerCase();
}

function getStatusClass(status) {
  const value = normalizeStatus(status);

  if (value === "pending") return "bg-amber-100 text-amber-700";
  if (value === "accept by rider") return "bg-blue-100 text-blue-700";
  if (value === "accept by restaurant") return "bg-cyan-100 text-cyan-700";
  if (value === "ready for pickup") return "bg-violet-100 text-violet-700";
  if (value === "picked up") return "bg-indigo-100 text-indigo-700";
  if (value === "delivered") return "bg-emerald-100 text-emerald-700";
  if (value.includes("cancelled")) return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-700";
}

function getAddonTotal(order) {
  const items = Array.isArray(order?.items) ? order.items : [];

  return items.reduce((sum, item) => {
    const addons = Array.isArray(item?.addons)
      ? item.addons
      : Array.isArray(item?.addOns)
      ? item.addOns
      : Array.isArray(item?.extraItems)
      ? item.extraItems
      : [];

    const quantity = toNumber(item?.quantity || 1);

    const addonTotal = addons.reduce((addonSum, addon) => {
      const addonPrice =
        toNumber(addon?.price) ||
        toNumber(addon?.amount) ||
        toNumber(addon?.basedPrice) ||
        toNumber(addon?.offerPrice);

      const addonQty = toNumber(addon?.quantity || 1);
      return addonSum + addonPrice * addonQty;
    }, 0);

    return sum + addonTotal * quantity;
  }, 0);
}

function getDisplayOrderAmount(order) {
  const explicitTotal =
    order?.totalAmount ??
    order?.orderAmount ??
    order?.grandTotal ??
    order?.payableAmount;

  if (explicitTotal !== undefined && explicitTotal !== null) {
    return toNumber(explicitTotal);
  }

  const itemTotal = (Array.isArray(order?.items) ? order.items : []).reduce(
    (sum, item) => {
      const price =
        toNumber(item?.offerPrice) ||
        toNumber(item?.sellingPrice) ||
        toNumber(item?.price) ||
        toNumber(item?.basedPrice);

      return sum + price * toNumber(item?.quantity || 1);
    },
    0
  );

  return itemTotal + getAddonTotal(order) + toNumber(order?.deliveryAmount);
}

export default function OrderCard({ order, slNo, getOrders }) {
  const [status, setStatus] = useState(order?.status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timelineModalOn, setTimeLineModalOn] = useState(false);

  const updateTime = useMemo(
    () => convertDateAsLocalTime(order?.updateTime),
    [order?.updateTime]
  );

  const displayTotal = useMemo(() => getDisplayOrderAmount(order), [order]);

  function handleCopyData(text) {
    navigator.clipboard.writeText(text);
    alert("Text copied.");
  }

  return (
    <tr className="border-b border-slate-100 text-center text-sm hover:bg-slate-50/70 transition">
      <td className="px-4 py-4 font-medium">{slNo + 1}</td>

      <td className="px-4 py-4 text-[13px] font-medium text-slate-700">
        <div className="flex items-center justify-center gap-1">
          <span>{order?._id}</span>
          <span onClick={() => handleCopyData(order?._id)} className="cursor-pointer">
            <CopyIcon />
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${getStatusClass(
            status
          )}`}
        >
          {status}
        </span>
      </td>

      <td className="px-4 py-4 text-[13px] text-slate-700">{order?.userId}</td>

      <td className="px-4 py-4 text-[13px] text-slate-700">
        <div className="flex items-center justify-center gap-1">
          <span>{order?.customerPhone}</span>
          <span onClick={() => handleCopyData(order?.customerPhone)} className="cursor-pointer">
            <CopyIcon />
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-[11px] text-slate-700">
        <div className="flex items-center justify-center gap-1">
          <span>{order?.restaurantId}</span>
          <span onClick={() => handleCopyData(order?.restaurantId)} className="cursor-pointer">
            <CopyIcon />
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-[12px] font-medium text-slate-700">
        {order?.restaurantName}
      </td>

      <td className="px-4 py-4 text-[13px] text-slate-700">{order?.riderId || "N/A"}</td>

      <td className="px-4 py-4">
        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-left min-w-[110px]">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Total</p>
          <p className="text-sm font-black text-slate-800">{formatMoney(displayTotal)}</p>
        </div>
      </td>

      <td className="px-4 py-4 text-[12px] text-slate-700 capitalize">
        {order?.peymentMethod || order?.paymentMethod || "N/A"}
      </td>

      <td className="px-4 py-4">
        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-left min-w-[105px]">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Fee</p>
          <p className="text-sm font-bold text-slate-700">
            {formatMoney(order?.deliveryAmount)}
          </p>
        </div>
      </td>

      <td className="px-4 py-4 text-[12px] text-slate-600">{updateTime}</td>

      <td className="px-4 py-4">
        <Button size="small" onClick={() => setTimeLineModalOn(!timelineModalOn)}>
          View
        </Button>

        <Modal isActive={timelineModalOn}>
          <TimelineContainer
            timeline={{
              riderAssignTime: order?.riderAssignTime || 0,
              pickupTime: order?.pickupTime || 0,
              deliveredTime: order?.deliveredTime || 0,
              restaurantAcceptTime: order?.restaurantAcceptTime || 0,
            }}
            handleClose={() => setTimeLineModalOn(!timelineModalOn)}
          />
        </Modal>
      </td>

      <td className="px-4 py-4 min-w-[180px]">
        <ChangeStatus order={order} status={status} setStatus={setStatus} />
      </td>

      <td className="px-4 py-4">
        <button
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Assign Rider
        </button>

        <AssignRiderModal
          order={order}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </td>

      <td className="px-4 py-4">
        <DeleteOrderButton order={order} getOrders={getOrders} />
      </td>

      <td className="px-4 py-4">
        <ViewOrderItem order={order} />
      </td>

      <td className="px-4 py-4">
        <Tag color={order?.platform === "web" ? "lime" : "geekblue"}>
          {order?.platform === "web" ? "web" : "android"}
        </Tag>
      </td>

      <td className="px-4 py-4">
        <Button size="small">
          <Link to={`/order-history?id=${order.userId}`}>View history</Link>
        </Button>
      </td>
    </tr>
  );
}