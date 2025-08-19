import React, { useEffect, useState } from "react";
import Layout from "./layout";
import CustomSkeleton from "../components/skeleton";
import FilterMenu from "../components/menu/filterMenu";
import MenuCard from "../components/menu/menuCard";
import FilterMenuByCategory from "../components/menu/FilterMenuByCategory";
import { apiAuthToken, apiPath } from "../../secrets";
import axios from "axios";

export default function MenuManagement() {
  const [menus, setMenus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  async function getMenus(page = 1) {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-menus?page=${page}&limit=${itemsPerPage}`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (data) {
        setMenus(data.menus);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching menus:", error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMenus(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 border rounded ${
            currentPage === i
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <Layout>
      <div>
        <h1 className="text-4xl text-center text-gray-500 font-bold mt-12">
          Menu Management
        </h1>
        <h1 className="text-2xl text-gray-500 text-center mt-4 font-black">
          All Menus
        </h1>
      </div>
      <div className="w-4/5 mx-auto my-4 flex items-center gap-8">
        <FilterMenu setMenus={setMenus} />
        <FilterMenuByCategory />
      </div>

      <div className="w-[90%] mx-auto overflow-scroll min-h-[250px]">
        <table className="w-full text-[12px]">
          <thead>
            <th className="text-center border px-2 text-gray-400">SL No</th>
            <th className="text-center border px-2 text-gray-400">ID</th>
            <th className="text-center border px-2 text-gray-400">
              Thumbnails
            </th>
            <th className="text-center border px-2 text-gray-400">
              Restaurant ID
            </th>
            <th className="text-center border px-2 text-gray-400">Category</th>
            <th className="text-center border px-2 text-gray-400">Status</th>
            <th className="text-center border px-2 text-gray-400">Title</th>
            <th className="text-center border px-2 text-gray-400">
              Description
            </th>
            <th className="text-center border px-2 text-gray-400">
              Based Price
            </th>
            <th className="text-center border px-2 text-gray-400">
              PlateformFee
            </th>
            <th className="text-center border px-2 text-gray-400">
              BasedPrice + plateformFee
            </th>
            <th className="text-center border px-2 text-gray-400">Discount</th>
            <th className="text-center border px-2 text-gray-400">
              Offer Price
            </th>
            <th className="text-center border px-2 text-gray-400">
              Change status
            </th>
            <th className="text-center border px-2 text-gray-400">
              Update Discount
            </th>
            <th className="text-center border px-2 text-gray-400">
              Update plateformFee
            </th>
            <th className="text-center border px-2 text-gray-400">
              Admin Approval
            </th>
            <th className="text-center border px-2 text-gray-400">Popular</th>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="18" className="text-center py-4">
                  <CustomSkeleton />
                </td>
              </tr>
            ) : menus && menus.length > 0 ? (
              menus.map((menu, index) => (
                <MenuCard
                  key={menu?._id}
                  menus={menus}
                  setMenus={setMenus}
                  menu={menu}
                  slNo={(currentPage - 1) * itemsPerPage + index + 1}
                  getMenus={getMenus}
                />
              ))
            ) : (
              <tr>
                <td colSpan="18" className="text-center py-4">
                  No menus found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 mt-12 mb-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        {renderPaginationButtons()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 mx-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Layout>
  );
}