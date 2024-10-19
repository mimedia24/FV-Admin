import React from "react";

export default function RestaurantDetails({ detail, totalMenu }) {
  return (
    <div className="w-4/5 mx-auto border p-6 my-5">
      <h1>Name: {detail?.name}</h1>
      <h1>Address: {detail?.address}</h1>
      <h1>Description: {detail?.description}</h1>
      <h1>Phone number: {detail?.phone}</h1>

      <h1>Total menu: {totalMenu}</h1>
    </div>
  );
}
