import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { Pagination, Empty } from "antd";
import RestaurantCard from "../components/restaurantCard";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import UpdateRestaurantPosition from "../components/restaurant/UpdateRestaurantPostion";
import PopularToggle from "../components/restaurant/TogglePopularRestaurant";

export default function RestrauntManagement() {
  const [restaurantList, setRestaurantList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchRestaurants = async (currentPage) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/list-of-restaurants?page=${currentPage}&limit=${pageSize}`,
        { headers: { "x-auth-token": apiAuthToken } }
      );

      if (data.success) {
        setRestaurantList(data.restaurants);
        setTotalCount(data.count || data.totalItems || 0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(page);
  }, [page]);

  return (
    <Layout>
      <div className="w-full px-6 py-8 bg-gray-50 min-h-screen">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-700 uppercase tracking-tight">
            Restaurant Management
          </h1>
          <p className="text-gray-500 mt-2">
            Managing{" "}
            <span className="font-bold text-blue-600">{totalCount}</span>{" "}
            registered partners
          </p>
        </header>

        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : restaurantList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {restaurantList.map((res) => (
              <div key={res._id} className="relative w-full max-w-xs bg-white rounded-xl shadow-lg border border-gray-200">
                <RestaurantCard
                  restaurant={res}
                  setRestaurant={setRestaurantList}
                  restaurantList={restaurantList}
                />
                {/* Position update UI directly under the card */}
                <UpdateRestaurantPosition
                  restaurantId={res._id}
                  currentPosition={res.position}
                  onUpdateSuccess={() => fetchRestaurants(page)}
                />

                {/* make restaurant for popular */}
                <PopularToggle
                  restaurantId={res._id}
                  initialStatus={res.isPopular | false}
                />
              </div>
            ))}
          </div>
        ) : (
          <Empty className="mt-20" description="No Restaurants Found" />
        )}

        <div className="mt-16 flex justify-center pb-20">
          <Pagination
            current={page}
            total={totalCount}
            pageSize={pageSize}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
            className="shadow-md rounded-full px-6 py-2 bg-white"
          />
        </div>
      </div>
    </Layout>
  );
}
