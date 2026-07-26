import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import EditOfferModal from "./EditOfferModal";
import { MdDelete } from "react-icons/md";
import { Button, message, Popconfirm } from "antd";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../../secrets";
import { resolveImageUrl, useImageFallback } from "../../helpers/imageUrl";

export default function OfferCard({ item, setAdvertisement }) {
  const [subMenu, setSubMenu] = React.useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleMenu() {
    setSubMenu(!subMenu);
  }

  const confirm = async () => {
    // console.log(e);
    // message.success("Click on Yes");

    const response = await axios.delete(
      `${apiPath}/offer/delete?id=${item._id}`,
      {
        headers: {
          "x-auth-token": apiAuthToken,
        },
      }
    );

    console.log(response);
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  return (
    <div className="max-w-[300px] border shadow-md p-4 rounded-md relative">
      <img
        src={resolveImageUrl(item.thumbnail)}
        alt={item.title || "Offer"}
        onError={useImageFallback}
      />
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
          <div className="absolute top-8 right-2 border-2  shadow-md rounded-sm bg-white">
            <ul className="w-full">
              <li
                className="bg-slate-300 w-full text-sm min-w-20 text-center flex items-center cursor-pointer justify-center gap-2"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                <MdEdit className="text-blue-500" /> edit
              </li>
              <li className="bg-slate-300 mt-2 text-sm w-full min-w-20 text-center flex items-center cursor-pointer justify-center gap-2">
                {/*  */}

                <Popconfirm
                  title="Delete the offer thumbnail"
                  description="Are you sure to delete this thumbnail?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>
                    <MdDelete /> delete
                  </Button>
                </Popconfirm>
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
