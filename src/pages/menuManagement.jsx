import React, { useEffect, useState } from "react";
import Layout from "./layout";
import handleApiRequest from "../helpers/handleApiRequest";
import { apiPath } from "../../secrets";
import useFetch from "../useFetch/useFetch";
import { Skeleton } from "antd";
import CustomSkeleton from "../components/skeleton";
import FilterMenu from "../components/menu/filterMenu";
import MenuCard from "../components/menu/menuCard";
import FilterMenuByCategory from "../components/menu/FilterMenuByCategory";

export default function MenuManagement() {
  const [menus, setMenus] = useState(null);
  const { loading, data } = useFetch("/admin/list-of-menus", {});
  useEffect(() => {
    setMenus(data?.menus);
  }, [data]);

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
      <div className="w-full flex  items-center justify-center mt-12">
        {loading ? <CustomSkeleton /> : null}
      </div>

      <div className="flex items-center justify-center gap-12  flex-wrap">
        {menus &&
          menus.length > 0 &&
          menus.map((menu) => (
            <MenuCard
              key={menu?._id}
              menus={menus}
              setMenus={setMenus}
              menu={menu}
            />
          ))}
      </div>
    </Layout>
  );
}
