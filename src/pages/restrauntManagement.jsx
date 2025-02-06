import React, { useEffect, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import CustomSkeleton from "../components/skeleton";
import { Card } from "antd";
import RestaurantCard from "../components/restaurantCard";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import Pagination from "../components/pagination/Pagination";
import toast from "react-hot-toast";

export default function RestrauntManagement() {
  const [restaurant, setRestaurant] = useState([]);
  const [count, setCount] = useState(0);

  const [page, setPage] = useState(1);

  async function fetchData() {
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-restaurants?page=1&limit=20`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );
      setRestaurant(data.restaurants);
      setCount(data.count);
    } catch (error) {
      console.log("fetching restaurant error : ", error);
    }
  }

  async function fetchMore() {
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-restaurants?page=${page}&limit=20`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      console.log("fetch more is called : ", data);
      if (data.success) {
        setRestaurant(data.restaurants);
      }
    } catch (error) {
      console.log("fetching restaurant error : ", error);

      if (
        error.response.data.message ===
        "No restaurants found. Please try again."
      ) {
        toast.error("End of information.");
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchMore();
  }, [page]);

  return (
    <Layout>
      <div>
        <h1 className="text-3xl text-center font-extrabold text-gray-400 my-8">
          Restaurant Management
        </h1>

        <h1 className="text-xl text-center font-extrabold text-gray-400 my-8">
          List of Restaurant
        </h1>
        <h1>
          <span>total restaurant is : {count}</span>
        </h1>

        <div className="grid h-[600px] overflow-y-scroll grid-cols-1 place-items-center lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {restaurant &&
            restaurant.map((restaurant) => (
              <RestaurantCard key={restaurant.name} restaurant={restaurant} />
            ))}
        </div>
      </div>

      <Pagination currentPage={page} updatePage={setPage} />
    </Layout>
  );
}
