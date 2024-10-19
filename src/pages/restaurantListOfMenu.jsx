import React, { useEffect, useState } from "react";
import Layout from "./layout";
import RestaurantDetails from "../components/restaurant/restaurantDetails";
import { useParams } from "react-router-dom";
import handleApiRequest from "../helpers/handleApiRequest";
import MenuCard from "../components/menu/menuCard";

export default function RestaurantListOfMenu() {
  const [restaurant, setRestaurant] = useState(null);
  const [menuList, setMenuList] = useState(null);
  const [restaurantDetail, setRestaurantDetail] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    async function handleListOfMenu() {
      const { result, loading } = await handleApiRequest(
        `/restaurant/list-of-menu?id=${id}`,
        {}
      );

      console.log(result);
      if (result?.success) {
        setMenuList(result.menu);
        setRestaurantDetail(result.restaurant);
      }
    }

    handleListOfMenu();
  }, [id]);

  return (
    <Layout>
      <div>
        <h1 className="text-3xl text-center text-gray-500 mt-4">
          List of menu
        </h1>

        <div>
          <RestaurantDetails
            detail={restaurantDetail}
            totalMenu={menuList?.length}
          />
        </div>

        <div className="w-full flex items-center gap-8 flex-wrap justify-center">
          {menuList &&
            menuList.length > 0 &&
            menuList.map((menu) => (
              <MenuCard menu={menu} key={menu?._id} setMenus={setMenuList} />
            ))}
        </div>
      </div>
    </Layout>
  );
}
