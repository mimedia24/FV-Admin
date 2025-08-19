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
import LoadingSpinner from "../components/LoadingSpinner";

export default function RestrauntManagement() {
  const [restaurantList, setRestaurant] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(null);

  const [page, setPage] = useState(1);

  async function fetchData() {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.log("fetching restaurant error : ", error);
      setLoading(false);
    }
  }

  async function fetchMore() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-restaurants?page=${page}&limit=20`,
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      // console.log("fetch more is called : ", data);
      if (data.success) {
        setRestaurant(data.restaurants);
        setLoading(false);
      }
    } catch (error) {
      console.log("fetching restaurant error : ", error);
      setLoading(false);

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
        <h1 className="w-4/5 mx-auto my-4">
          <span>Total : {restaurantList && restaurantList.length}</span>
        </h1>

        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-wrap gap-8 px-20">
            {restaurantList &&
              restaurantList.map((res) => (
                <RestaurantCard
                  key={res.name}
                  restaurant={res}
                  setRestaurant={setRestaurant}
                  restaurantList={restaurantList}
                />
              ))}
          </div>
        )}
        <Pagination currentPage={page} updatePage={setPage} />
      </div>
    </Layout>
  );
}
