import React, { useEffect, useState } from "react";
import Layout from "./layout";
import useFetch from "../useFetch/useFetch";
import OrderCard from "../components/orderCard";
import PaginationContainer from "../components/pagination";
import CustomSkeleton from "../components/skeleton";
import SortOrdersList from "../components/sortOrderList";
import AssignRiderModal from "../components/assignRiderModal";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";

export default function OrderManagement() {
  const [orders, setOrders] = useState(null);
  // const { data, loading } = useFetch("/admin/list-of-orders");

  // loading
  const [loading, setLoading] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function getOrders() {
    try {
      setLoading(true);
      setOrders([]);
      const { data } = await axios.get(`${apiPath}/admin/list-of-orders`, {
        headers: {
          "x-auth-token": apiAuthToken,
        },
      });

      console.log(data);
      if (data) {
        setLoading(false);
        setOrders(data.orders);
      }
    } catch (error) {
      setLoading(false);
      throw new Error(error.message);
    }
  }
  useEffect(() => {
    getOrders();
  }, []);

  // useEffect(() => {
  //   setOrders(data);
  // }, [data]);

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

        <div>
          <div className="overflow-x-scroll w-full text-sm">
            <table className="w-[95%] mx-auto border p-2 ">
              <thead>
                <tr>
                  <th className="border py-4 px-1">SL NO</th>
                  <th className="border py-4 px-1">Order ID</th>
                  <th className="border py-4 px-1 min-w-32">Status</th>
                  <th className="border py-4 px-1">User ID</th>
                  <th className="border py-4 px-1">Restaurant ID</th>
                  <th className="border py-4 px-1">Rider ID</th>
                  <th className="border py-4 px-1 max-w-[80px]">
                    Order Amount
                  </th>
                  <th className="border py-4 px-1 ">Delivery amount</th>
                  <th className="border py-4 px-1 min-w-[150px]">
                    Update Time
                  </th>
                  <th className="border py-4 px-1">Change Status</th>
                  <th className="border py-4 px-1">Assign Rider</th>
                  <th className="border py-4 px-1">Delete</th>
                  <th className="border py-4 px-1"> view items</th>
                </tr>
              </thead>

              <tbody>
                {loading ? <h1>Loading...Please wait</h1> : null}
                {orders?.length > 0
                  ? orders?.map((order, index) => (
                      <OrderCard
                        order={order}
                        key={order._id}
                        slNo={index}
                        getOrders={getOrders}
                      />
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full flex items-center justify-center mt-12 mx-auto">
          {orders === null ? <CustomSkeleton /> : null}
        </div>

        <div className="flex items-center justify-center gap-12 flex-wrap"></div>

        <div className="w-full flex items-center justify-center mt-5">
          <PaginationContainer setOrders={setOrders} orders={orders} />
        </div>
      </div>
    </Layout>
  );
}
