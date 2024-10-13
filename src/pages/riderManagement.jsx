import React, { useEffect, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import OrderCard from "../components/orderCard";
import PaginationContainer from "../components/pagination";
import CustomSkeleton from "../components/skeleton";
import SortOrdersList from "../components/sortOrderList";
import RiderCard from "../components/riderCard";

export default function OrderManagement() {
  const [riders, setRiders] = useState(null);

  const { data, loading } = useFetch("/admin/list-of-riders");

  useEffect(() => {
    console.log(data);
    setRiders(data);
  }, [data]);

  return (
    <Layout>
      <div className="w-full py-4">
        <h1 className="text-3xl text-center font-extrabold text-gray-400 my-8">
          Riders Management
        </h1>

        <h1 className="text-xl text-center font-extrabold text-gray-400 my-8">
          List of riders
        </h1>

        <div className="ml-48 my-4">
          Filter: <SortOrdersList setRiders={setRiders} />
        </div>
        <div className="flex items-center justify-center gap-12 flex-wrap">
          {riders === null ? <CustomSkeleton /> : null}
          {riders &&
            riders?.riders.map((rider) => (
              <RiderCard order={rider} key={rider._id} />
            ))}
        </div>
      </div>
    </Layout>
  );
}
