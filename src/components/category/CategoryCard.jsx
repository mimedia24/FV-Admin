import { Card } from "antd";
import { useState } from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { apiAuthToken, apiPath } from "../../../secrets";
import axios from "axios";
import toast from "react-hot-toast";
import EditCategoryModal from "./EditCategoryModal";

export default function CategoryCard({ category, setCategories }) {
  const [menu, setMenu] = useState(false);
  const [editModal, setEditModal] = useState(false);

  async function handleDeleteCategory(category) {
    console.log(category._id);
    const response = await axios.delete(
      `${apiPath}/category/delete?id=${category._id}`,
      {
        headers: {
          "x-auth-token": apiAuthToken,
        },
      }
    );

    console.log(response.data);
    const data = await response.data;

    if (data.success) {
      toast.success(data.message);
      setCategories(data.category);
    } else {
      toast.error(data.message);
    }

    setMenu(false);
  }

  return (
    <Card
      style={{
        width: 350,
      }}
    >
      <div>
        <img
          src={category?.thumbnail}
          alt="thumnail"
          className="w-20 h-20 rounded-full object-cover border"
        />
      </div>
      <h1>{category?.name}</h1>
      <h1>Description: {category?.description}</h1>
      <h1>Meta: {category?.meta}</h1>

      <div className="absolute top-4 right-2 cursor-pointer">
        {menu ? (
          <RxCross1 onClick={() => setMenu(!menu)} />
        ) : (
          <PiDotsThreeOutlineVerticalFill onClick={() => setMenu(!menu)} />
        )}
      </div>

      {menu ? (
        <div className=" border shadow-md absolute top-8 p-2 right-2">
          <ul>
            <li
              className="px-3 flex items-center gap-1 py-1 bg-gray-300 rounded-sm cursor-pointer"
              onClick={() => handleDeleteCategory(category)}
            >
              <MdDelete className="text-red-500" /> delete
            </li>
            <li
              className="px-3 flex items-center gap-1 py-1 bg-gray-300 rounded-sm cursor-pointer mt-1"
              onClick={() => setEditModal(!editModal)}
            >
              <MdEdit /> edit
            </li>
          </ul>
        </div>
      ) : null}

      {/* edit category */}
      {editModal ? (
        <EditCategoryModal
          setCategories={setCategories}
          category={category}
          isModalOpenT={editModal}
        />
      ) : null}
    </Card>
  );
}
