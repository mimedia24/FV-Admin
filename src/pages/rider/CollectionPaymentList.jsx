import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios/axiosInstance";
import Layout from "../layout";

export default function CashCollectionList() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 15;
  const statusOptions = ["Pending", "Processing", "Completed", "Invalid"];
  const statusColor = {
    Pending: "bg-yellow-400",
    Processing: "bg-blue-400",
    Completed: "bg-green-500",
    Invalid: "bg-red-500",
  };

  const fetchCollections = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/v2/rider/collection/list?page=${pageNumber}&limit=${limit}`
      );
      if (data) {
        setCollections(data.result);
        setTotalPages(Math.ceil((data.result.length || limit) / limit));
      }
    } catch (err) {
      console.error("Failed to fetch collections", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections(page);
  }, [page]);

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      const { data } = await axiosInstance.put(
        `/v2/rider/collection/payment/update-status?paymentId=${paymentId}&status=${newStatus}`
      );

      if (data.success) {
        setCollections((prev) =>
          prev.map((c) =>
            c._id === paymentId ? { ...c, status: newStatus } : c
          )
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-6">Cash Collection List</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : collections.length === 0 ? (
          <p className="text-gray-500">No collections found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Rider ID</th>
                  <th className="px-4 py-2 border">Sender Number</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Transaction ID</th>
                  <th className="px-4 py-2 border">Payment Method</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Update At</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-sm">{c.riderId}</td>
                    <td className="px-4 py-2 border text-sm">
                      {c.senderNumber}
                    </td>
                    <td className="px-4 py-2 border text-sm">BDT {c.amount}</td>
                    <td className="px-4 py-2 border text-sm">
                      {c.transactionId}
                    </td>
                    <td className="px-4 py-2 border text-sm">
                      {c.paymentMethod}
                    </td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          statusColor[c.status] || "bg-gray-400"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-sm">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border text-sm">
                      {new Date(c.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleStatusChange(c._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 border rounded">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
