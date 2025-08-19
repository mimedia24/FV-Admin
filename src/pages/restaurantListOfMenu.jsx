import React, { useEffect, useState } from "react";
import Layout from "./layout";
import RestaurantDetails from "../components/restaurant/restaurantDetails";
import { useParams } from "react-router-dom";
import MenuCard from "../components/menu/menuCard";
import axiosInstance from "../services/axios/axiosInstance";

export default function RestaurantListOfMenu() {
  const [restaurantDetail, setRestaurantDetail] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/restaurant/list-of-menu?id=${id}`
        );

        if (data?.success) {
          setMenuList(data.menu);
          setRestaurantDetail(data.restaurant);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu: ", err);
        setLoading(false);
      }
    }

    fetchMenu();
  }, [id]);

  return (
    <Layout>
      <div className="w-full px-6 py-6">
        <h1 className="text-3xl text-center font-bold text-gray-700 mb-6">
          {restaurantDetail?.name || "Restaurant"} Menu
        </h1>

        {/* Restaurant Info */}
        {restaurantDetail && (
          <div className="mb-6">
            <RestaurantDetails
              detail={restaurantDetail}
              totalMenu={menuList?.length}
            />
          </div>
        )}

        {/* Menu Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Loading menus...
            </p>
          ) : menuList.length > 0 ? (
            menuList?.map((menu, index) => (
              <MenuCard
                key={menu._id}
                menu={menu}
                slNo={index}
                setMenus={setMenuList}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No menu items found.
            </p>
          )}
        </div> */}
      </div>
    </Layout>
  );
}
