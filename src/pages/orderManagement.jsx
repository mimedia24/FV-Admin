import React, { useEffect, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import OrderCard from "../components/orderCard";
import PaginationContainer from "../components/pagination";
import CustomSkeleton from "../components/skeleton";
import SortOrdersList from "../components/sortOrderList";
import AssignRiderModal from "../components/assignRiderModal";

export default function OrderManagement() {
  const [orders, setOrders] = useState(null);
  const { data, loading } = useFetch("/admin/list-of-orders");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setOrders(data);
  }, [data]);

  return (
    <Layout>
      <div className="w-full py-4">
        <h1 className="text-3xl text-center font-extrabold text-gray-400 my-8">
          Order Management
        </h1>

        <h1 className="text-xl text-center font-extrabold text-gray-400 my-8">
          List of orders
        </h1>

        <div className="w-full flex items-center flex-wrap gap-8">
          <div className="ml-48 my-4">
            Filter: <SortOrdersList setOrders={setOrders} />
          </div>
          <div>
            {/* <button className="w-fit px-12 py-2 bg-blue-500 text-white rounded-md" onClick={() => setIsModalOpen(true)}>
              Assign Rider
            </button> */}
            {/* modal */}
            {/* <AssignRiderModal
              setIsModalOpen={setIsModalOpen}
              isModalOpen={isModalOpen}
            /> */}
          </div>
        </div>
        <div className="flex items-center justify-center gap-12 flex-wrap">
          {orders === null ? <CustomSkeleton /> : null}
          {orders &&
            orders?.orders.map((order) => (
              <OrderCard order={order} key={order._id} />
            ))}
        </div>

        <div className="w-full flex items-center justify-center mt-5">
          <PaginationContainer setOrders={setOrders} orders={orders} />
        </div>
      </div>
    </Layout>
  );
}
