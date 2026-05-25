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

function getItemUnitPrice(item) {
  const offerPrice = toNumber(item?.offerPrice);

  if (offerPrice > 0) {
    return offerPrice;
  }

  const basedPrice = toNumber(item?.basedPrice);
  const platformFee = toNumber(item?.plateformFee ?? item?.platformFee);
  const discountRate = toNumber(item?.discountRate);

  if (basedPrice > 0 || platformFee > 0) {
    const sellingPrice = basedPrice + platformFee;
    const discountAmount = (sellingPrice * discountRate) / 100;

    return Math.max(0, sellingPrice - discountAmount);
  }

  const sellingPrice = toNumber(item?.sellingPrice);

  if (sellingPrice > 0) {
    return sellingPrice;
  }

  return toNumber(item?.price);
}

function getItemsTotal(order) {
  const items = Array.isArray(order?.items) ? order.items : [];

  return items.reduce((sum, item) => {
    return sum + getItemUnitPrice(item) * toNumber(item?.quantity || 1);
  }, 0);
}

function getRiderTip(order) {
  return (
    toNumber(order?.tip) ||
    toNumber(order?.tips) ||
    toNumber(order?.riderTip) ||
    toNumber(order?.riderTips) ||
    toNumber(order?.riderTipAmount) ||
    toNumber(order?.deliveryTip) ||
    toNumber(order?.tipsAmount)
  );
}

function getVoucherAmount(order) {
  const voucherObjectAmount =
    toNumber(order?.voucher?.amount) ||
    toNumber(order?.voucher?.discount) ||
    toNumber(order?.voucher?.discountAmount) ||
    toNumber(order?.coupon?.amount) ||
    toNumber(order?.coupon?.discount) ||
    toNumber(order?.coupon?.discountAmount);

  return (
    toNumber(order?.voucherAmount) ||
    toNumber(order?.voucherDiscount) ||
    toNumber(order?.voucherDiscountAmount) ||
    toNumber(order?.appliedVoucherAmount) ||
    toNumber(order?.couponAmount) ||
    toNumber(order?.couponDiscount) ||
    toNumber(order?.discountAmount) ||
    voucherObjectAmount
  );
}

function getVoucherCode(order) {
  return (
    order?.voucherCode ||
    order?.couponCode ||
    order?.voucher?.code ||
    order?.voucher?.name ||
    order?.voucher?.title ||
    order?.coupon?.code ||
    order?.coupon?.name ||
    ""
  );
}

function getDeliveryAmount(order) {
  return toNumber(order?.deliveryAmount ?? order?.deliveryFee);
}

function getSubtotalBeforeVoucher(order) {
  const directSubtotal =
    toNumber(order?.subtotal) ||
    toNumber(order?.subTotal) ||
    toNumber(order?.itemsTotal) ||
    toNumber(order?.cartTotal);

  if (directSubtotal > 0) {
    return directSubtotal;
  }

  return getItemsTotal(order) + getAddonTotal(order);
}

function getFinalPayableAmount(order) {
  const totalAfterVoucher = toNumber(order?.totalAfterVoucherApplied);

  if (totalAfterVoucher > 0) {
    return totalAfterVoucher;
  }

  const finalAmount =
    toNumber(order?.finalAmount) ||
    toNumber(order?.payableAmount) ||
    toNumber(order?.grandTotal);

  if (finalAmount > 0) {
    return finalAmount;
  }

  const totalAmount = toNumber(order?.totalAmount || order?.orderAmount);

  if (totalAmount > 0) {
    return totalAmount;
  }

  const subtotal = getSubtotalBeforeVoucher(order);
  const deliveryAmount = getDeliveryAmount(order);
  const riderTip = getRiderTip(order);
  const voucherAmount = getVoucherAmount(order);

  return Math.max(0, subtotal + deliveryAmount + riderTip - voucherAmount);
}

export default function OrderCard({ order, slNo, getOrders }) {
  const [status, setStatus] = useState(order?.status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timelineModalOn, setTimeLineModalOn] = useState(false);

  const updateTime = useMemo(
    () => convertDateAsLocalTime(order?.updateTime),
    [order?.updateTime]
  );

  const subtotal = useMemo(() => getSubtotalBeforeVoucher(order), [order]);
  const deliveryAmount = useMemo(() => getDeliveryAmount(order), [order]);
  const riderTip = useMemo(() => getRiderTip(order), [order]);
  const voucherAmount = useMemo(() => getVoucherAmount(order), [order]);
  const voucherCode = useMemo(() => getVoucherCode(order), [order]);
  const finalPayableAmount = useMemo(() => getFinalPayableAmount(order), [order]);

  function handleCopyData(text) {
    if (!text) return;

    navigator.clipboard.writeText(text);
    alert("Text copied.");
  }

  return (
    <tr className="border-b border-slate-100 text-center text-sm hover:bg-slate-50/70 transition">
      <td className="px-4 py-4 font-medium">{slNo + 1}</td>

      <td className="px-4 py-4 text-[13px] font-medium text-slate-700">
        <div className="flex items-center justify-center gap-1">
          <span>{order?._id}</span>

          <span
            onClick={() => handleCopyData(order?._id)}
            className="cursor-pointer"
          >
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

      <td className="px-4 py-4 text-[13px] text-slate-700">
        {order?.userId}
      </td>

      <td className="px-4 py-4 text-[13px] text-slate-700">
        <div className="flex items-center justify-center gap-1">
          <span>{order?.customerPhone}</span>

          <span
            onClick={() => handleCopyData(order?.customerPhone)}
            className="cursor-pointer"
          >
            <CopyIcon />
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-[11px] text-slate-700">
        <div className="flex items-center justify-center gap-1">
          <span>{order?.restaurantId}</span>

          <span
            onClick={() => handleCopyData(order?.restaurantId)}
            className="cursor-pointer"
          >
            <CopyIcon />
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-[12px] font-medium text-slate-700">
        {order?.restaurantName}
      </td>

      <td className="px-4 py-4 text-[13px] text-slate-700">
        {order?.riderId || "N/A"}
      </td>

      <td className="px-4 py-4">
        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-left min-w-[135px] border border-slate-100">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Total
          </p>

          <p className="text-[15px] font-black text-emerald-600">
            {formatMoney(finalPayableAmount)}
          </p>

          <div className="mt-1 space-y-0.5">
            <p className="text-[10px] font-medium text-slate-500">
              Items {formatMoney(subtotal)}
            </p>

            <p className="text-[10px] font-medium text-blue-500">
              Delivery {formatMoney(deliveryAmount)}
            </p>

            {riderTip > 0 ? (
              <p className="text-[10px] font-medium text-purple-500">
                Tip {formatMoney(riderTip)}
              </p>
            ) : null}

            {voucherAmount > 0 ? (
              <p className="text-[10px] font-bold text-red-500">
                Voucher -{formatMoney(voucherAmount)}
                {voucherCode ? ` (${voucherCode})` : ""}
              </p>
            ) : null}
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-[12px] text-slate-700 capitalize">
        {order?.peymentMethod || order?.paymentMethod || "N/A"}
      </td>

      <td className="px-4 py-4 text-[12px] text-slate-600">
        {updateTime}
      </td>

      <td className="px-4 py-4">
        <Button
          size="small"
          onClick={() => setTimeLineModalOn(!timelineModalOn)}
        >
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