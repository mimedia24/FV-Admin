import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import EditOfferModal from "./EditOfferModal";
export default function OfferCard({ item, setAdvertisement }) {
  const [subMenu, setSubMenu] = React.useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleMenu() {
    setSubMenu(!subMenu);
  }

  return (
    <div className="max-w-[300px] border shadow-md p-4 rounded-md relative">
      <img src={item.thumbnail} alt="" />
      <div>
        <h1>{item.title}</h1>
        <h1>{item.link || "currently no link available"}</h1>
        <h1>Discount: {item.discountRate}</h1>

        <div
          className="absolute top-2 right-2 text-2xl cursor-pointer"
          onClick={handleMenu}
        >
          <BsThreeDots />
        </div>

        {subMenu ? (
          <div className="absolute top-8 right-2 border-2  shadow-md rounded-sm">
            <ul className="w-full">
              <li
                className="bg-slate-300 w-full min-w-20 text-center flex items-center cursor-pointer justify-center gap-2"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                <MdEdit className="text-blue-500" /> edit
              </li>
            </ul>
          </div>
        ) : null}

        {isModalOpen ? (
          <EditOfferModal
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            offer={item}
            setAdvertisement={setAdvertisement}
          />
        ) : null}
      </div>
    </div>
  );
}
