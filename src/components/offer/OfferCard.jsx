import React from "react";
import { BsThreeDots } from "react-icons/bs";
export default function OfferCard({ item }) {
  return (
    <div className="max-w-[300px] border shadow-md p-4 rounded-md relative">
      <img src={item.thumbnail} alt="" />
      <div>
        <h1>{item.title}</h1>
        <h1>{item.link || "currently no link available"}</h1>
        <h1>Discount: {item.discountRate}</h1>

        <div>

        </div>
      </div>
    </div>
  );
}
