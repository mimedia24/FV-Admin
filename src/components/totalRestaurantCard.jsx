import useFetch from "../useFetch/useFetch";
import { apiAuthToken } from "../../secrets";
import { Card } from "antd";
import { Spin } from "antd";

export default function TotalRestaurantCard() {
  const { data, loading } = useFetch(`/admin/list-of-restaurants`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "x-auth-token": apiAuthToken,
    },
    credentials: "include",
  });

  return (
    <div>
      <Card
        title="Total Restaurants"
        style={{
          width: 200,
          margin: "0 auto",
        }}
      >
        {loading ? (
          <Spin className="w-full h-full relative text-center" />
        ) : (
          <p className="text-4xl font-extrabold text-gray-500 text-center">
            {data?.count}
          </p>
        )}
      </Card>
    </div>
  );
}
