import React, { useEffect, useState } from "react";
import Layout from "./layout";
import RestaurantCard from "../components/restaurantCard";
import Pagination from "../components/pagination/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import toast from "react-hot-toast";

export default function RestrauntManagement() {
  const [restaurantList, setRestaurant] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchRestaurants = async (pageNumber = page) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiPath}/admin/list-of-restaurants?page=${pageNumber}&limit=${limit}`, {
        headers: { "x-auth-token": apiAuthToken },
      });

      if (data.success) {
        setRestaurant(data.restaurants);
        const totalCount = data.count || data.restaurants.length;
        setTotalPages(Math.ceil(totalCount / limit));
      }
    } catch (error) {
      console.log("Fetching restaurant error:", error);
      toast.error("Failed to fetch restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(page);
  }, [page]);

  return (
    <Layout>
      <div className="w-full py-4 px-4">
        <h1 className="text-3xl text-center font-extrabold text-gray-700 my-4">
          Restaurant Management
        </h1>
        <h2 className="text-xl text-center font-semibold text-gray-600 mb-4">
          List of Restaurants
        </h2>
        <p className="text-center mb-6 text-gray-500">Total: {restaurantList.length}</p>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {restaurantList.map((res) => (
              <RestaurantCard
                key={res._id}
                restaurant={res}
                setRestaurant={setRestaurant}
                restaurantList={restaurantList}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <Pagination currentPage={page} totalPages={totalPages} updatePage={setPage} />
        </div>
      </div>
    </Layout>
  );
}
