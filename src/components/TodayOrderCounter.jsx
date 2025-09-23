import useFetch from "../useFetch/useFetch";
import { apiAuthToken } from "../../secrets";
import { Card, Spin } from "antd";
import { useMemo } from "react";

export default function TodayOrderCard() {
  // Calculate timestamp only once
  const todayTimestamp = useMemo(() => new Date().getTime(), []);

  const { data, loading } = useFetch(
    `/admin/today-order?type=counter&date=${todayTimestamp}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": apiAuthToken,
      },
      credentials: "include",
    }
  );

  return (
    <div>
      <Card
        title="Total Orders"
        style={{
          width: 200,
          height: 150,
          margin: "0 auto",
        }}
      >
        {loading ? (
          <Spin className="w-full h-full relative text-center" />
        ) : (
          <p className="text-4xl font-extrabold text-gray-500 text-center">
            {data?.order || 0}
          </p>
        )}
      </Card>
    </div>
  );
}
