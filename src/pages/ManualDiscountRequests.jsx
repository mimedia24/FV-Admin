import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  BadgeDollarSign,
  StickyNote,
  UserRound,
  Phone,
  CalendarDays,
  Trash2,
} from "lucide-react";
import Layout from "./layout";

const fallbackBaseUrl = "https://api.foodversedelivery.com/api";

const normalApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_PATH ||
  fallbackBaseUrl;

const apiBaseUrl = normalApiBaseUrl.endsWith("/v3")
  ? normalApiBaseUrl
  : `${normalApiBaseUrl}/v3`;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    Cookies.get("accessToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("AccessToken");

  if (token) {
    config.headers.AccessToken = token;
  }

  return config;
});

const money = (value) =>
  `BDT ${Number(value || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`;

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusBadge = (status) => {
  if (status === "approved") {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  if (status === "rejected") {
    return "bg-red-100 text-red-700 border-red-200";
  }

  return "bg-amber-100 text-amber-700 border-amber-200";
};

function ManualDiscountRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [deleteLoadingId, setDeleteLoadingId] = useState("");
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get("/master-admin/manual-discount/requests", {
        params: {
          status: status === "all" ? undefined : status,
          limit: 300,
        },
      });

      const payload = response?.data;

      const result = Array.isArray(payload?.result)
        ? payload.result
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      setRequests(result);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load manual discount requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const updateStatus = async (id, nextStatus) => {
    try {
      setActionLoadingId(id);

      const reviewNote =
        nextStatus === "approved"
          ? "Approved by main admin"
          : "Rejected by main admin";

      await api.put(`/master-admin/manual-discount/${id}/status`, {
        status: nextStatus,
        reviewNote,
      });

      toast.success(`Request ${nextStatus}.`);

      await fetchRequests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${nextStatus} manual discount.`
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const deleteRequest = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this manual discount request?"
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoadingId(id);

      await api.delete(`/master-admin/manual-discount/${id}`);

      toast.success("Manual discount request deleted.");

      await fetchRequests();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete manual discount request."
      );
    } finally {
      setDeleteLoadingId("");
    }
  };

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return requests;

    return requests.filter((item) => {
      return (
        String(item?.agentName || "").toLowerCase().includes(q) ||
        String(item?.agentPhoneNumber || "").toLowerCase().includes(q) ||
        String(item?.note || "").toLowerCase().includes(q) ||
        String(item?.zoneId || "").toLowerCase().includes(q) ||
        String(item?.amount || "").toLowerCase().includes(q)
      );
    });
  }, [requests, search]);

  const totalPending = requests.filter(
    (item) => item.status === "pending"
  ).length;

  const totalAmount = filteredRequests.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 px-4 py-5 md:px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600">
                Food Verse Main Admin
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Manual Discount Requests
              </h1>

              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                Review manual discount requests from the agent panel. Only
                approved discounts will be counted in the agent report.
              </p>
            </div>

            <button
              onClick={fetchRequests}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              <RefreshCcw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Clock3 size={16} /> Current List
              </div>

              <div className="mt-2 text-2xl font-black capitalize text-slate-950">
                {status}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <BadgeDollarSign size={16} /> Showing Amount
              </div>

              <div className="mt-2 text-2xl font-black text-slate-950">
                {money(totalAmount)}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Clock3 size={16} /> Pending Count
              </div>

              <div className="mt-2 text-2xl font-black text-amber-600">
                {totalPending}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                ["pending", "Pending"],
                ["approved", "Approved"],
                ["rejected", "Rejected"],
                ["all", "All"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    status === key
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 lg:w-[360px]">
              <Search size={17} className="text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agent, phone, note, amount..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="overflow-x-auto">
            <table className="min-w-[1180px] w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.18em] text-slate-400">
                  <th className="px-3 py-4">Agent</th>
                  <th className="px-3 py-4">Phone</th>
                  <th className="px-3 py-4">Zone</th>
                  <th className="px-3 py-4">Date</th>
                  <th className="px-3 py-4">Amount</th>
                  <th className="px-3 py-4">Note</th>
                  <th className="px-3 py-4">Status</th>
                  <th className="px-3 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-slate-500"
                    >
                      Loading manual discount requests...
                    </td>
                  </tr>
                ) : filteredRequests.length ? (
                  filteredRequests.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <UserRound size={16} className="text-slate-400" />
                          {item.agentName || "Zone Agent"}
                        </div>
                      </td>

                      <td className="px-3 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone size={15} className="text-slate-400" />
                          {item.agentPhoneNumber || "-"}
                        </div>
                      </td>

                      <td className="px-3 py-4 text-slate-600">
                        Zone {item.zoneId || "-"}
                      </td>

                      <td className="px-3 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={15} className="text-slate-400" />
                          {formatDate(item.date)}
                        </div>
                      </td>

                      <td className="px-3 py-4 font-black text-slate-950">
                        {money(item.amount)}
                      </td>

                      <td className="px-3 py-4">
                        <div className="max-w-[260px] rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                          <div className="mb-1 flex items-center gap-1 font-bold text-slate-500">
                            <StickyNote size={13} /> Reason
                          </div>

                          {item.note || "No note"}
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize ${statusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          {item.status === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus(item._id, "approved")
                                }
                                disabled={
                                  actionLoadingId === item._id ||
                                  deleteLoadingId === item._id
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                              >
                                <CheckCircle2 size={15} />
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  updateStatus(item._id, "rejected")
                                }
                                disabled={
                                  actionLoadingId === item._id ||
                                  deleteLoadingId === item._id
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                              >
                                <XCircle size={15} />
                                Reject
                              </button>
                            </>
                          ) : null}

                          <button
                            onClick={() => deleteRequest(item._id)}
                            disabled={
                              actionLoadingId === item._id ||
                              deleteLoadingId === item._id
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700 disabled:opacity-60"
                          >
                            <Trash2 size={15} />
                            {deleteLoadingId === item._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-slate-500"
                    >
                      No manual discount request found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ManualDiscountRequests;