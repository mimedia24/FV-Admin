import React, { useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import { Card } from "antd";
import RestaurantCard from "../components/restaurantCard";
export default function RestrauntManagement() {
  const [restaurant, setRestaurant] = useState(null);

  const { data, loading } = useFetch("/admin/list-of-restaurants", {});

  return (
    <Layout>
      <div>
        <h1 className="text-3xl text-center font-extrabold text-gray-400 my-8">
          Restaurant Management
        </h1>

        <h1 className="text-xl text-center font-extrabold text-gray-400 my-8">
          List of Restaurant
        </h1>

        <div className="w-fit mx-auto">
          {loading ? <CustomSkeleton /> : null}
        </div>


            <div className="w-full flex items-center justify-center gap-8 flex-wrap">
                {
                    data && data.restaurants.map((restaurant) => {
                        return <RestaurantCard key={restaurant._id} restaurant={restaurant}/>
                    })
                }
            </div>


      </div>
    </Layout>
  );
}
