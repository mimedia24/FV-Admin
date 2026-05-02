import React from "react";

export default function RestaurantDetails({ detail, totalMenu }) {
  return (
    <div className="mx-auto my-5 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md md:w-4/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">{detail?.name}</h2>

          {detail?.address && (
            <p className="text-gray-600">
              <span className="font-semibold">Address:</span> {detail.address}
            </p>
          )}

          {detail?.description && (
            <p className="text-gray-600">
              <span className="font-semibold">Description:</span>{" "}
              {detail.description}
            </p>
          )}

          {detail?.phone && (
            <p className="text-gray-600">
              <span className="font-semibold">Phone:</span> {detail.phone}
            </p>
          )}

          <p className="text-gray-600">
            <span className="font-semibold">Commission:</span>{" "}
            {Number(detail?.commissionRate || 0)}%
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <div className="rounded-md bg-blue-100 px-3 py-1 font-semibold text-blue-800">
            Total Menus: {totalMenu}
          </div>

          {detail?.rating && (
            <div className="rounded-md bg-green-100 px-3 py-1 font-semibold text-green-800">
              Rating: {detail.rating}/5
            </div>
          )}
        </div>
      </div>
    </div>
  );
}