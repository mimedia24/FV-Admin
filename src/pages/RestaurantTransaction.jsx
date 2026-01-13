import React, { useEffect, useState, useMemo } from "react";
import Layout from "./layout";
import axiosInstance from "../services/axios/axiosInstance";
import { useSearchParams } from "react-router-dom";

function RestaurantTransaction() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (id) getRestaurantProfile();
  }, [id]);

  async function getRestaurantProfile() {
    try {
      const { data } = await axiosInstance.get(
        `/restaurant/get-profile?id=${id}`
      );

      if (data.success) {
        setTransactions(data.restaurant?.transactions || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }

  const filteredData = useMemo(() => {
    return transactions.filter((item) => {
      if (filter === "All") return true;
      if (!item?.type) return false;

      const type = item.type.toLowerCase();

      if (filter === "Sale") return type.includes("sale");
      if (filter === "Deduction") return type.includes("deduction");

      return false;
    });
  }, [transactions, filter]);

  const totalAmount = filteredData.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Transaction History
            </h2>
            <p className="text-sm text-gray-500">
              Managing Restaurant ID: {id}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("All")}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === "All"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("Sale")}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === "Sale"
                ? "bg-green-600 text-white shadow-md"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Sale
          </button>

          <button
            onClick={() => setFilter("Deduction")}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === "Deduction"
                ? "bg-red-600 text-white shadow-md"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            Deduction
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Transactions" value={filteredData.length} />
          <StatCard title="Total Amount" value={`${totalAmount} ৳`} />
        </div>

        {/* LIST */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredData.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredData.map((trx) => (
                <TransactionRow key={trx._id} trx={trx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">No {filter} records found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const TransactionRow = ({ trx }) => {
  const isSale = trx?.type?.toLowerCase().includes("sale");

  return (
    <div className="p-5 hover:bg-gray-50 transition flex justify-between items-center">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-gray-800">{trx.trxTitle}</p>

          <span
            className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
              isSale ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {trx.type}
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(trx.date).toLocaleString()} • Ref: {trx.reference}
        </p>

        {trx.description && (
          <p className="text-sm text-gray-600 mt-2 italic">{trx.description}</p>
        )}
      </div>

      <div className="text-right ml-4">
        <p
          className={`text-lg font-black ${
            isSale ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSale ? "+" : "-"}
          {trx.amount} ৳
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="p-4 rounded-2xl border bg-white shadow-sm border-gray-100">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {title}
    </p>
    <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

export default RestaurantTransaction;
