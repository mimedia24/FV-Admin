import React, { useState } from "react";
import { Card, Tag, Popconfirm, Button } from "antd";
import { MdDelete, MdEdit, MdDescription, MdInfoOutline } from "react-icons/md";
import { FaFire } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import EditCategoryModal from "./EditCategoryModal";
import { apiAuthToken, apiPath } from "../../../secrets";

export default function CategoryCard({ category, setCategories }) {
  const [editModal, setEditModal] = useState(false);

  // Function to handle category deletion with Antd's Popconfirm
  async function handleDeleteCategory() {
    try {
      const response = await axios.delete(
        `${apiPath}/category/delete?id=${category._id}`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message);
        setCategories(data.category);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error("An error occurred while deleting the category.");
    }
  }

  return (
    <>
      <Card
        className="relative w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
        bodyStyle={{ padding: 0 }}
      >
        {/* Actions Buttons */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <Button
            shape="circle"
            icon={<MdEdit className="text-gray-500" />}
            size="small"
            onClick={() => setEditModal(true)}
            className="hover:bg-gray-100"
          />
          <Popconfirm
            title="Delete category?"
            description={`Are you sure you want to delete "${category?.name}"?`}
            onConfirm={handleDeleteCategory}
            okText="Yes"
            cancelText="No"
          >
            <Button
              shape="circle"
              icon={<MdDelete className="text-red-500" />}
              size="small"
              className="hover:bg-gray-100"
            />
          </Popconfirm>
        </div>

        {/* Thumbnail Image */}
        <div className="flex justify-center p-4">
          <img
            src={category?.thumbnail || "https://placehold.co/80x80/E5E7EB/4B5563?text=IMG"}
            alt="category thumbnail"
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
          />
        </div>

        {/* Content Section */}
        <div className="p-4 pt-0 text-center space-y-2">
          <h2 className="text-lg font-bold text-gray-800 truncate">
            {category?.name}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <MdDescription className="text-gray-400" />
            <p className="truncate">{category?.description}</p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <MdInfoOutline className="text-gray-400" />
            <p className="truncate">{category?.meta}</p>
          </div>
        </div>

        {/* Popularity Tag */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <Tag
            color={category?.isPopular ? "gold" : "default"}
            className="flex items-center gap-1 text-xs font-semibold"
          >
            <FaFire className={category?.isPopular ? "text-yellow-500" : "text-gray-400"} />
            {category?.isPopular ? "Popular" : "Regular"}
          </Tag>
        </div>
      </Card>

      {/* Edit Category Modal */}
      {editModal && (
        <EditCategoryModal
          setCategories={setCategories}
          category={category}
          isModalOpenT={editModal}
        />
      )}
    </>
  );
}
