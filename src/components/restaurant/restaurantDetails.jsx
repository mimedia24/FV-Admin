import React from "react";
import { Tag } from "antd";

export default function RestaurantDetails({ detail, totalMenu }) {
  return (
    <div className="w-full md:w-4/5 mx-auto bg-white shadow-md rounded-lg p-6 my-5 border border-gray-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Left Info */}
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">{detail?.name}</h2>
          {detail?.address && (
            <p className="text-gray-600">
              <span className="font-semibold">Address:</span> {detail.address}
            </p>
          )}
          {detail?.description && (
            <p className="text-gray-600">
              <span className="font-semibold">Description:</span> {detail.description}
            </p>
          )}
          {detail?.phone && (
            <p className="text-gray-600">
              <span className="font-semibold">Phone:</span> {detail.phone}
            </p>
          )}
        </div>

        {/* Right Stats */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-md">
            Total Menus: {totalMenu}
          </div>
          {detail?.rating && (
            <div className="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-md">
              Rating: {detail.rating}/5
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
