import React, { useMemo, useState } from "react";
import { Modal, Button } from "antd";

const toNumber = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (value) =>
  `BDT ${toNumber(value).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;

function getItemAddons(item) {
  if (Array.isArray(item?.addons)) return item.addons;
  if (Array.isArray(item?.addOns)) return item.addOns;
  if (Array.isArray(item?.extraItems)) return item.extraItems;
  return [];
}

export default function ViewOrderItem({ order }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const summary = useMemo(() => {
    const items = Array.isArray(order?.items) ? order.items : [];

    let itemBaseTotal = 0;
    let itemSellingTotal = 0;
    let addonTotal = 0;

    items.forEach((item) => {
      const qty = toNumber(item?.quantity || 1);
      const basePrice = toNumber(item?.basedPrice);
      const sellingPrice =
        toNumber(item?.offerPrice) ||
        toNumber(item?.sellingPrice) ||
        toNumber(item?.price) ||
        basePrice;

      itemBaseTotal += basePrice * qty;
      itemSellingTotal += sellingPrice * qty;

      getItemAddons(item).forEach((addon) => {
        const addonPrice =
          toNumber(addon?.price) ||
          toNumber(addon?.amount) ||
          toNumber(addon?.basedPrice) ||
          toNumber(addon?.offerPrice);

        const addonQty = toNumber(addon?.quantity || 1);
        addonTotal += addonPrice * addonQty * qty;
      });
    });

    const deliveryFee = toNumber(order?.deliveryAmount);
    const grandTotal =
      toNumber(order?.totalAmount) || itemSellingTotal + addonTotal + deliveryFee;

    return {
      itemBaseTotal,
      itemSellingTotal,
      addonTotal,
      deliveryFee,
      grandTotal,
    };
  }, [order]);

  return (
    <>
      <Button size="small" type="primary" onClick={() => setIsModalOpen(true)}>
        View
      </Button>

      <Modal
        title="Order Items List"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={980}
      >
        <div className="space-y-5">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border px-3 py-3 text-center">SL</th>
                  <th className="border px-3 py-3 text-center">Item Name</th>
                  <th className="border px-3 py-3 text-center">Restaurant Price</th>
                  <th className="border px-3 py-3 text-center">Restaurant Total</th>
                  <th className="border px-3 py-3 text-center">Selling Price</th>
                  <th className="border px-3 py-3 text-center">Selling Total</th>
                  <th className="border px-3 py-3 text-center">Qty</th>
                  <th className="border px-3 py-3 text-center">Addons</th>
                </tr>
              </thead>

              <tbody>
                {(Array.isArray(order?.items) ? order.items : []).map((item, index) => {
                  const qty = toNumber(item?.quantity || 1);
                  const basePrice = toNumber(item?.basedPrice);
                  const sellingPrice =
                    toNumber(item?.offerPrice) ||
                    toNumber(item?.sellingPrice) ||
                    toNumber(item?.price) ||
                    basePrice;

                  const addons = getItemAddons(item);

                  return (
                    <tr key={index}>
                      <td className="border px-3 py-3 text-center">{index + 1}</td>
                      <td className="border px-3 py-3 text-center font-medium">{item?.name}</td>
                      <td className="border px-3 py-3 text-center">{formatMoney(basePrice)}</td>
                      <td className="border px-3 py-3 text-center">
                        {formatMoney(basePrice * qty)}
                      </td>
                      <td className="border px-3 py-3 text-center">{formatMoney(sellingPrice)}</td>
                      <td className="border px-3 py-3 text-center">
                        {formatMoney(sellingPrice * qty)}
                      </td>
                      <td className="border px-3 py-3 text-center">{qty}</td>
                      <td className="border px-3 py-3">
                        {addons.length > 0 ? (
                          <div className="space-y-2">
                            {addons.map((addon, addonIndex) => {
                              const addonPrice =
                                toNumber(addon?.price) ||
                                toNumber(addon?.amount) ||
                                toNumber(addon?.basedPrice) ||
                                toNumber(addon?.offerPrice);

                              return (
                                <div
                                  key={addonIndex}
                                  className="rounded-xl bg-slate-50 px-3 py-2 text-left"
                                >
                                  <p className="font-medium text-slate-700">
                                    {addon?.name || addon?.title || `Addon ${addonIndex + 1}`}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {formatMoney(addonPrice)}
                                    {addon?.quantity ? ` × ${addon.quantity}` : ""}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-slate-400">No addons</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Item Base Total</p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {formatMoney(summary.itemBaseTotal)}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Item Selling Total</p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {formatMoney(summary.itemSellingTotal)}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Addons Total</p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {formatMoney(summary.addonTotal)}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Delivery Fee</p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {formatMoney(summary.deliveryFee)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs uppercase tracking-wide text-blue-500">Grand Total</p>
            <p className="mt-2 text-2xl font-black text-blue-700">
              {formatMoney(summary.grandTotal)}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}