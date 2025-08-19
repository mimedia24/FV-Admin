import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios/axiosInstance";
import Layout from "../layout";

function WithdrawList() {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusOptions = ["Pending", "Processing", "Completed", "Invalid"];
  const limit = 20;

  const fetchWithdrawList = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/v2/rider/withdraw/list?page=${pageNumber}&limit=${limit}`
      );
      if (data.success) {
        setWithdraws(data.result);
        setTotalPages(Math.ceil(data.pagination.total / data.pagination.limit || limit));
      }
    } catch (error) {
      console.error("Failed to fetch withdraw list", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawList(page);
  }, [page]);

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      const { data } = await axiosInstance.put(
        `/v2/rider/withdraw/update-status?paymentId=${paymentId}&status=${newStatus}`
      );

      if (data.success) {
        setWithdraws((prev) =>
          prev.map((w) => (w._id === paymentId ? { ...w, status: newStatus } : w))
        );
        alert("Status updated successfully");
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  const statusColor = {
    Pending: "bg-yellow-400",
    Processing: "bg-blue-400",
    Completed: "bg-green-500",
    Invalid: "bg-red-500",
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-6">Withdraw List</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : withdraws.length === 0 ? (
          <p className="text-gray-500">No withdraws found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Rider ID</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Payment Method</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdraws.map((w) => (
                  <tr key={w._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-sm">{w.riderId}</td>
                    <td className="px-4 py-2 border text-sm">{w.phoneNumber}</td>
                    <td className="px-4 py-2 border text-sm">BDT {w.amount}</td>
                    <td className="px-4 py-2 border text-sm">{w.paymentMethod}</td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${statusColor[w.status] || "bg-gray-400"}`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-sm">
                      {new Date(w.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        value={w.status}
                        onChange={(e) => handleStatusChange(w._id, e.target.value)}
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
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

export default WithdrawList;
