import React, { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import axios from "axios";
import Cookies from "js-cookie";
import { apiAuthToken, apiPath } from "../../secrets";
import {
  Button,
  Empty,
  Input,
  Modal,
  Spin,
  Tabs,
  Tag,
  message,
} from "antd";
import {
  RefreshCw,
  Share2,
  Download,
  CalendarDays,
  ClipboardCheck,
  ReceiptText,
  Bike,
  Gift,
  Wallet,
  Store,
  Utensils,
  TrendingUp,
  Percent,
  Eye,
  Trash2,
} from "lucide-react";

const toNumber = (value) => {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (value) =>
  `BDT ${Math.round(toNumber(value)).toLocaleString("en-BD")}`;

const formatSignedMoney = (value) => {
  const n = toNumber(value);
  if (n < 0) return `-${formatMoney(Math.abs(n))}`;
  if (n > 0) return `+${formatMoney(n)}`;
  return formatMoney(0);
};

const getLocalDateString = (date = new Date()) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
};

const getWeekStart = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day;
  const start = new Date(date.setDate(diff));
  return getLocalDateString(start);
};

const getMonthStart = () => {
  const date = new Date();
  return getLocalDateString(new Date(date.getFullYear(), date.getMonth(), 1));
};

const today = getLocalDateString();

const defaultReport = {
  range: {
    startDate: today,
    endDate: today,
  },
  summary: {
    totalOrdersInRange: 0,
    completedOrders: 0,
    voucherAppliedOrders: 0,
    foodSale: 0,
    restaurantSale: 0,
    foodMargin: 0,
    deliveryFee: 0,
    riderFee: 0,
    deliveryProfit: 0,
    riderTips: 0,
    voucherExpense: 0,
    manualDiscount: 0,
    totalAmount: 0,
    restaurantCommissionProfit: 0,
    grossProfit: 0,
    netProfit: 0,
  },
  restaurantRows: [],
  dailyRows: [],
  orders: [],
};

const getDiscountDate = (item) => {
  const raw =
    item?.date ||
    item?.discountDate ||
    item?.requestDate ||
    item?.createdAt ||
    item?.updatedAt ||
    "";

  if (!raw) return "";

  if (typeof raw === "string") {
    const directDate = raw.slice(0, 10);

    if (/^\\d{4}-\\d{2}-\\d{2}$/.test(directDate)) {
      return directDate;
    }
  }

  const d = new Date(raw);

  if (Number.isNaN(d.getTime())) {
    return String(raw).slice(0, 10);
  }

  return getLocalDateString(d);
};

const getDiscountAmount = (item) => {
  return toNumber(
    item?.amount ??
      item?.discountAmount ??
      item?.manualDiscount ??
      item?.manualDiscountAmount ??
      item?.value ??
      0
  );
};

const getDiscountStatus = (item) => {
  return String(item?.status || item?.requestStatus || "approved").toLowerCase();
};

const getDiscountZoneId = (item) => {
  return String(
    item?.zoneId ||
      item?.zoneID ||
      item?.zone_id ||
      item?.zone?._id ||
      item?.zone?.zoneId ||
      ""
  ).trim();
};

const isApprovedDiscount = (item) => {
  const status = getDiscountStatus(item);
  return status === "approved" || status === "complete" || status === "completed";
};

const isDiscountInRange = (item, startDate, endDate, zoneId = "") => {
  const date = getDiscountDate(item);
  const itemZoneId = getDiscountZoneId(item);
  const selectedZoneId = String(zoneId || "").trim();

  const zoneMatched =
    !selectedZoneId || !itemZoneId || String(itemZoneId) === selectedZoneId;

  return isApprovedDiscount(item) && zoneMatched && date >= startDate && date <= endDate;
};

const getListFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.discounts)) return payload.discounts;
  if (Array.isArray(payload?.manualDiscounts)) return payload.manualDiscounts;
  if (Array.isArray(payload?.requests)) return payload.requests;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.list)) return payload.list;
  return [];
};

const uniqueDiscountRows = (rows = []) => {
  const map = new Map();

  rows.filter(Boolean).forEach((item, index) => {
    const key =
      item?._id ||
      item?.id ||
      item?.requestId ||
      `${getDiscountZoneId(item)}-${getDiscountDate(item)}-${getDiscountAmount(
        item
      )}-${index}`;

    map.set(String(key), item);
  });

  return Array.from(map.values());
};

function StatCard({
  title,
  value,
  helper,
  icon,
  gradient = "from-blue-600 to-cyan-500",
  dark = false,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] p-5 shadow-sm ${
        dark
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl`}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p
            className={`m-0 text-[11px] font-black uppercase tracking-[0.22em] ${
              dark ? "text-slate-400" : "text-slate-400"
            }`}
          >
            {title}
          </p>

          <h3
            className={`m-0 mt-3 text-3xl font-black tracking-tight ${
              dark ? "text-white" : "text-slate-950"
            }`}
          >
            {value}
          </h3>

          <p
            className={`m-0 mt-2 text-sm ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {helper}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniLine({ label, value, icon, tone = "text-slate-700" }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-white/80">{icon}</span>
        <span className="text-sm font-bold text-white/90">{label}</span>
      </div>

      <span className={`text-sm font-black ${tone}`}>{value}</span>
    </div>
  );
}

function ProfitReports() {
  const [activeRange, setActiveRange] = useState("today");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [zoneId, setZoneId] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(defaultReport);
  const [approvedDiscounts, setApprovedDiscounts] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);

  const baseSummary = report?.summary || defaultReport.summary;

  const approvedManualDiscountsInRange = useMemo(() => {
    return (approvedDiscounts || [])
      .filter((item) =>
        isDiscountInRange(
          item,
          report?.range?.startDate,
          report?.range?.endDate,
          zoneId
        )
      )
      .sort((a, b) => (getDiscountDate(a) < getDiscountDate(b) ? 1 : -1));
  }, [approvedDiscounts, report?.range?.startDate, report?.range?.endDate, zoneId]);

  const manualDiscountTotal = useMemo(() => {
    return approvedManualDiscountsInRange.reduce(
      (sum, item) => sum + getDiscountAmount(item),
      0
    );
  }, [approvedManualDiscountsInRange]);

  const summary = useMemo(() => {
    const grossProfit = toNumber(baseSummary.grossProfit);
    const netBeforeManual = toNumber(baseSummary.netProfit);

    return {
      ...baseSummary,
      manualDiscount: manualDiscountTotal,
      grossProfit,
      netProfit: netBeforeManual - manualDiscountTotal,
    };
  }, [baseSummary, manualDiscountTotal]);

  const reportTitle = useMemo(() => {
    if (activeRange === "today") return "Today";
    if (activeRange === "week") return "This Week";
    if (activeRange === "month") return "This Month";
    return "Custom Range";
  }, [activeRange]);

  const getApiBaseCandidates = () => {
    const rawBase = String(apiPath || "").replace(/\/$/, "");

    const bases = [];

    if (rawBase) {
      bases.push(rawBase);

      if (!rawBase.endsWith("/v3")) {
        bases.push(`${rawBase}/v3`);
      }
    }

    return Array.from(new Set(bases));
  };

  const getAuthHeaders = () => {
    const accessToken =
      Cookies.get("accessToken") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("AccessToken") ||
      apiAuthToken;

    return {
      "x-auth-token": apiAuthToken,
      AccessToken: accessToken,
    };
  };

  const fetchApprovedDiscounts = async ({
    nextStartDate = startDate,
    nextEndDate = endDate,
    nextZoneId = zoneId,
  } = {}) => {
    const collectedRows = [];
    const bases = getApiBaseCandidates();

    const endpointConfigs = [
      {
        endpoint: "/master-admin/manual-discount/requests",
        params: {
          status: "approved",
          limit: 500,
        },
      },
      {
        endpoint: "/zone/manual-discount/approved",
        params: {
          startDate: nextStartDate,
          endDate: nextEndDate,
        },
      },
      {
        endpoint: "/zone/manual-discount/list",
        params: {
          startDate: nextStartDate,
          endDate: nextEndDate,
          status: "approved",
        },
      },
    ];

    if (String(nextZoneId || "").trim()) {
      endpointConfigs.forEach((item) => {
        item.params.zoneId = String(nextZoneId).trim();
      });
    }

    for (const base of bases) {
      for (const item of endpointConfigs) {
        try {
          const { data } = await axios.get(`${base}${item.endpoint}`, {
            params: item.params,
            headers: getAuthHeaders(),
            validateStatus: () => true,
          });

          const rows = getListFromPayload(data);

          if (rows.length) {
            collectedRows.push(...rows);
          }
        } catch (error) {
          console.log(
            `Manual discount endpoint failed: ${base}${item.endpoint}`,
            error?.message
          );
        }
      }
    }

    const uniqueRows = uniqueDiscountRows(collectedRows).filter((item) => {
      const status = String(item?.status || "approved").toLowerCase();
      const date = getDiscountDate(item);
      const itemZoneId = item?.zoneId || item?.zoneID || item?.zone_id;

      const zoneMatched = String(nextZoneId || "").trim()
        ? String(itemZoneId || "") === String(nextZoneId).trim()
        : true;

      return (
        status === "approved" &&
        date &&
        date >= nextStartDate &&
        date <= nextEndDate &&
        zoneMatched
      );
    });

    setApprovedDiscounts(uniqueRows);

    return uniqueRows;
  };

  const fetchReport = async ({
    nextStartDate = startDate,
    nextEndDate = endDate,
    nextZoneId = zoneId,
  } = {}) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("startDate", nextStartDate);
      params.set("endDate", nextEndDate);

      if (String(nextZoneId || "").trim()) {
        params.set("zoneId", String(nextZoneId).trim());
      }

      const [reportResponse, manualDiscountRows] = await Promise.all([
        axios.get(`${apiPath}/admin/report/profit?${params.toString()}`, {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }),
        fetchApprovedDiscounts({
          nextStartDate,
          nextEndDate,
          nextZoneId,
        }),
      ]);

      const { data } = reportResponse;
      setApprovedDiscounts(manualDiscountRows || []);

      if (data?.success) {
        setReport({
          range: data.range || {
            startDate: nextStartDate,
            endDate: nextEndDate,
          },
          summary: data.summary || defaultReport.summary,
          restaurantRows: data.restaurantRows || [],
          dailyRows: data.dailyRows || [],
          orders: data.orders || [],
        });
      } else {
        setReport(defaultReport);
        message.error(data?.message || "Failed to load report.");
      }
    } catch (error) {
      console.log("Profit report fetch failed:", error?.response || error);
      setReport(defaultReport);
      message.error(
        error?.response?.data?.message || "Failed to load profit report."
      );
    } finally {
      setLoading(false);
    }
  };

  const applyQuickRange = (type) => {
    let nextStart = today;
    let nextEnd = today;

    if (type === "week") {
      nextStart = getWeekStart();
      nextEnd = today;
    }

    if (type === "month") {
      nextStart = getMonthStart();
      nextEnd = today;
    }

    if (type === "custom") {
      setActiveRange("custom");
      return;
    }

    setActiveRange(type);
    setStartDate(nextStart);
    setEndDate(nextEnd);

    fetchReport({
      nextStartDate: nextStart,
      nextEndDate: nextEnd,
      nextZoneId: zoneId,
    });
  };

  const handleCustomSearch = () => {
    setActiveRange("custom");
    fetchReport({
      nextStartDate: startDate,
      nextEndDate: endDate,
      nextZoneId: zoneId,
    });
  };

  const handleShare = async () => {
    const text = `Foodverse Admin Profit Report
Range: ${report?.range?.startDate} to ${report?.range?.endDate}
Completed Orders: ${summary.completedOrders}
Total Amount: ${formatMoney(summary.totalAmount)}
Voucher Expense: ${formatMoney(summary.voucherExpense)}
Manual Discount: ${formatMoney(summary.manualDiscount)}
Net Profit: ${formatMoney(summary.netProfit)}`;

    try {
      await navigator.clipboard.writeText(text);
      message.success("Report summary copied.");
    } catch (error) {
      message.error("Could not copy report summary.");
    }
  };

  const handleExportCSV = () => {
    const rows = [
      [
        "Order ID",
        "Date",
        "Status",
        "Restaurant",
        "Customer Phone",
        "Payment",
        "Platform",
        "Food Sale",
        "Restaurant Sale",
        "Delivery Fee",
        "Rider Tips",
        "Voucher Expense",
        "Voucher Code",
        "Total Amount",
      ],
      ...(report?.orders || []).map((order) => [
        order?._id,
        order?.orderDate,
        order?.status,
        order?.restaurantName,
        order?.customerPhone,
        order?.paymentMethod,
        order?.platform,
        order?.foodSale,
        order?.restaurantSale,
        order?.deliveryFee,
        order?.riderTips,
        order?.voucherExpense,
        order?.voucherCode,
        order?.totalAmount,
      ]),
      [],
      ["Approved Manual Discount", "", "", "", "", "", "", "", "", "", "", "", "", manualDiscountTotal],
      ["Final Net Profit After Manual Discount", "", "", "", "", "", "", "", "", "", "", "", "", summary.netProfit],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `foodverse-admin-profit-report-${startDate}-to-${endDate}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchReport({
      nextStartDate: today,
      nextEndDate: today,
      nextZoneId: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dailyRowsWithManualDiscount = useMemo(() => {
    return (report?.dailyRows || []).map((row) => {
      const rowDate = row?.date;

      const manualDiscount = (approvedDiscounts || [])
        .filter(
          (item) =>
            isApprovedDiscount(item) &&
            getDiscountDate(item) === rowDate &&
            (!String(zoneId || "").trim() ||
              !getDiscountZoneId(item) ||
              getDiscountZoneId(item) === String(zoneId).trim())
        )
        .reduce((sum, item) => sum + getDiscountAmount(item), 0);

      return {
        ...row,
        manualDiscount,
        netProfit: toNumber(row?.netProfit) - manualDiscount,
      };
    });
  }, [report?.dailyRows, approvedDiscounts, zoneId]);

  const tabItems = [
    {
      key: "restaurant",
      label: "Restaurant Wise",
      children: (
        <RestaurantTable rows={report?.restaurantRows || []} loading={loading} />
      ),
    },
    {
      key: "daily",
      label: "Daily Summary",
      children: (
        <DailyTable rows={dailyRowsWithManualDiscount || []} loading={loading} />
      ),
    },
    {
      key: "manualDiscount",
      label: `Manual Discount (${approvedManualDiscountsInRange.length})`,
      children: (
        <ManualDiscountTable rows={approvedManualDiscountsInRange || []} loading={loading} />
      ),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-3 md:p-6">
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-blue-600">
                  Food Verse Main Admin Report Control
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                  Profit Reports
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Only completed/successful orders are counted. Voucher expense
                  and approved manual discount are counted as business expense.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    fetchReport({
                      nextStartDate: startDate,
                      nextEndDate: endDate,
                      nextZoneId: zoneId,
                    })
                  }
                  loading={loading}
                  className="!h-11 !rounded-2xl !border-slate-200 !px-5 !font-bold"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} />
                    Refresh
                  </div>
                </Button>

                <Button
                  onClick={handleShare}
                  className="!h-11 !rounded-2xl !border-slate-200 !px-5 !font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Share2 size={16} />
                    Share
                  </div>
                </Button>

                <Button
                  onClick={handleExportCSV}
                  className="!h-11 !rounded-2xl !border-slate-950 !bg-slate-950 !px-5 !font-bold !text-white"
                >
                  <div className="flex items-center gap-2">
                    <Download size={16} />
                    Export CSV
                  </div>
                </Button>
              </div>
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap gap-2">
              <Button
                type={activeRange === "today" ? "primary" : "default"}
                onClick={() => applyQuickRange("today")}
                className="!rounded-full !font-bold"
              >
                Today
              </Button>

              <Button
                type={activeRange === "week" ? "primary" : "default"}
                onClick={() => applyQuickRange("week")}
                className="!rounded-full !font-bold"
              >
                This Week
              </Button>

              <Button
                type={activeRange === "month" ? "primary" : "default"}
                onClick={() => applyQuickRange("month")}
                className="!rounded-full !font-bold"
              >
                This Month
              </Button>

              <Button
                type={activeRange === "custom" ? "primary" : "default"}
                onClick={() => setActiveRange("custom")}
                className="!rounded-full !font-bold"
              >
                Custom Range
              </Button>
            </div>

            <div className="relative z-10 mt-6 grid gap-3 xl:grid-cols-[1fr_1fr_180px_auto]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  <CalendarDays size={14} />
                  Start Date
                </p>

                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="!h-11 !rounded-xl"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  <CalendarDays size={14} />
                  End Date
                </p>

                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="!h-11 !rounded-xl"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Zone ID
                </p>

                <Input
                  placeholder="Optional"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="!h-11 !rounded-xl"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="primary"
                  onClick={handleCustomSearch}
                  loading={loading}
                  className="!h-11 !w-full !rounded-2xl !px-6 !font-black"
                >
                  Apply Filter
                </Button>
              </div>
            </div>

            <div className="relative z-10 mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              Showing: {reportTitle} — {report?.range?.startDate} to{" "}
              {report?.range?.endDate}
            </div>
          </section>

          {loading ? (
            <div className="flex justify-center rounded-[28px] border border-slate-200 bg-white py-16">
              <Spin />
            </div>
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Completed Orders"
              value={summary.completedOrders}
              helper={`Total range orders: ${summary.totalOrdersInRange || 0}`}
              icon={<ClipboardCheck size={22} />}
              gradient="from-blue-600 to-cyan-500"
            />

            <StatCard
              title="Total Food Sale"
              value={formatMoney(summary.foodSale)}
              helper="Customer food/item sale"
              icon={<Utensils size={22} />}
              gradient="from-emerald-600 to-teal-500"
            />

            <StatCard
              title="Restaurant Sale"
              value={formatMoney(summary.restaurantSale)}
              helper="Restaurant base sale"
              icon={<Store size={22} />}
              gradient="from-violet-600 to-fuchsia-500"
            />

            <StatCard
              title="Final Received"
              value={formatMoney(summary.totalAmount)}
              helper="Final order totals after voucher"
              icon={<Wallet size={22} />}
              gradient="from-slate-800 to-slate-600"
            />
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-[32px] bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-500 p-5 text-white shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="m-0 text-sm font-bold text-white/80">
                    Sale & Voucher Summary
                  </p>

                  <h2 className="m-0 mt-2 text-4xl font-black">
                    {formatMoney(summary.totalAmount)}
                  </h2>

                  <p className="m-0 mt-1 text-sm text-white/80">
                    Successful order amount only
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <ReceiptText size={22} />
                </div>
              </div>

              <div className="space-y-3">
                <MiniLine
                  label="Food Sale"
                  value={formatMoney(summary.foodSale)}
                  icon={<Utensils size={16} />}
                  tone="text-white"
                />

                <MiniLine
                  label="Delivery Fee"
                  value={formatMoney(summary.deliveryFee)}
                  icon={<Bike size={16} />}
                  tone="text-white"
                />

                <MiniLine
                  label="Rider Tips"
                  value={formatMoney(summary.riderTips)}
                  icon={<Wallet size={16} />}
                  tone="text-white"
                />

                <MiniLine
                  label={`Voucher Expense (${summary.voucherAppliedOrders || 0} orders)`}
                  value={`-${formatMoney(summary.voucherExpense)}`}
                  icon={<Gift size={16} />}
                  tone="text-red-100"
                />

                <MiniLine
                  label={`Approved Manual Discount (${approvedManualDiscountsInRange.length})`}
                  value={`-${formatMoney(summary.manualDiscount)}`}
                  icon={<Trash2 size={16} />}
                  tone="text-red-100"
                />
              </div>
            </div>

            <div className="rounded-[32px] bg-slate-950 p-5 text-white shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="m-0 text-sm font-bold text-slate-400">
                    Profit Summary
                  </p>

                  <h2
                    className={`m-0 mt-2 text-4xl font-black ${
                      toNumber(summary.netProfit) >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatSignedMoney(summary.netProfit)}
                  </h2>

                  <p className="m-0 mt-1 text-sm text-slate-400">
                    Net = commission + food margin + delivery profit - voucher -
                    approved manual discount
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="space-y-3">
                <MiniLine
                  label="Restaurant Commission"
                  value={formatMoney(summary.restaurantCommissionProfit)}
                  icon={<Percent size={16} />}
                  tone="text-white"
                />

                <MiniLine
                  label="Food Sell Margin"
                  value={formatMoney(summary.foodMargin)}
                  icon={<Utensils size={16} />}
                  tone="text-white"
                />

                <MiniLine
                  label="Delivery Profit"
                  value={formatSignedMoney(summary.deliveryProfit)}
                  icon={<Bike size={16} />}
                  tone={
                    toNumber(summary.deliveryProfit) >= 0
                      ? "text-emerald-300"
                      : "text-red-300"
                  }
                />

                <MiniLine
                  label="Voucher Expense"
                  value={`-${formatMoney(summary.voucherExpense)}`}
                  icon={<Gift size={16} />}
                  tone="text-red-300"
                />

                <MiniLine
                  label="Approved Manual Discount"
                  value={`-${formatMoney(summary.manualDiscount)}`}
                  icon={<Trash2 size={16} />}
                  tone="text-red-300"
                />

                <MiniLine
                  label="Gross Profit"
                  value={formatSignedMoney(summary.grossProfit)}
                  icon={<TrendingUp size={16} />}
                  tone="text-emerald-300"
                />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="m-0 text-xl font-black text-slate-900">
                  Report Directory
                </h2>

                <p className="m-0 mt-1 text-sm text-slate-500">
                  Restaurant-wise and day-wise completed order report.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setDiscountModalOpen(true)}
                  className="!h-10 !rounded-xl !font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 size={16} />
                    Manual Discounts ({approvedManualDiscountsInRange.length})
                  </div>
                </Button>

                <Button
                  onClick={() => setOrderModalOpen(true)}
                  className="!h-10 !rounded-xl !font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    View Orders ({report?.orders?.length || 0})
                  </div>
                </Button>
              </div>
            </div>

            <div className="p-4 md:p-5">
              <Tabs defaultActiveKey="restaurant" items={tabItems} />
            </div>
          </section>
        </div>
      </div>

      <OrdersModal
        open={orderModalOpen}
        onCancel={() => setOrderModalOpen(false)}
        orders={report?.orders || []}
      />

      <ManualDiscountModal
        open={discountModalOpen}
        onCancel={() => setDiscountModalOpen(false)}
        rows={approvedManualDiscountsInRange || []}
      />
    </Layout>
  );
}

function RestaurantTable({ rows, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spin />
      </div>
    );
  }

  if (!rows?.length) {
    return <Empty description="No restaurant report found" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1150px] text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Restaurant</th>
            <th className="px-4 py-3">Orders</th>
            <th className="px-4 py-3">Food Sale</th>
            <th className="px-4 py-3">Restaurant Sale</th>
            <th className="px-4 py-3">Food Margin</th>
            <th className="px-4 py-3">Commission</th>
            <th className="px-4 py-3">Delivery Fee</th>
            <th className="px-4 py-3">Rider Tips</th>
            <th className="px-4 py-3">Voucher</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Net Profit</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.restaurantId} className="border-t border-slate-100">
              <td className="px-4 py-3">
                <div className="font-bold text-slate-800">
                  {row.restaurantName}
                </div>
                <div className="text-[11px] text-slate-400">
                  {row.restaurantId}
                </div>
              </td>

              <td className="px-4 py-3 font-black text-blue-600">
                {row.completedOrders}
              </td>

              <td className="px-4 py-3">{formatMoney(row.foodSale)}</td>

              <td className="px-4 py-3">{formatMoney(row.restaurantSale)}</td>

              <td className="px-4 py-3 font-bold text-emerald-600">
                {formatMoney(row.foodMargin)}
              </td>

              <td className="px-4 py-3">
                <div className="font-bold">
                  {formatMoney(row.commissionProfit)}
                </div>

                <div className="text-[11px] text-slate-400">
                  Rate {toNumber(row.commissionRate)}%
                </div>
              </td>

              <td className="px-4 py-3">{formatMoney(row.deliveryFee)}</td>

              <td className="px-4 py-3">{formatMoney(row.riderTips)}</td>

              <td className="px-4 py-3 font-bold text-red-500">
                -{formatMoney(row.voucherExpense)}
              </td>

              <td className="px-4 py-3 font-black">
                {formatMoney(row.totalAmount)}
              </td>

              <td className="px-4 py-3 font-black text-purple-600">
                {formatMoney(row.netProfit)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DailyTable({ rows, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spin />
      </div>
    );
  }

  if (!rows?.length) {
    return <Empty description="No daily report found" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Orders</th>
            <th className="px-4 py-3">Food Sale</th>
            <th className="px-4 py-3">Restaurant Sale</th>
            <th className="px-4 py-3">Delivery Fee</th>
            <th className="px-4 py-3">Rider Tips</th>
            <th className="px-4 py-3">Voucher</th>
            <th className="px-4 py-3">Manual Discount</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Net Profit</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.date} className="border-t border-slate-100">
              <td className="px-4 py-3 font-bold text-slate-800">
                {row.date}
              </td>

              <td className="px-4 py-3 font-black text-blue-600">
                {row.completedOrders}
              </td>

              <td className="px-4 py-3">{formatMoney(row.foodSale)}</td>

              <td className="px-4 py-3">{formatMoney(row.restaurantSale)}</td>

              <td className="px-4 py-3">{formatMoney(row.deliveryFee)}</td>

              <td className="px-4 py-3">{formatMoney(row.riderTips)}</td>

              <td className="px-4 py-3 font-bold text-red-500">
                -{formatMoney(row.voucherExpense)}
              </td>

              <td className="px-4 py-3 font-bold text-red-500">
                -{formatMoney(row.manualDiscount)}
              </td>

              <td className="px-4 py-3 font-black">
                {formatMoney(row.totalAmount)}
              </td>

              <td
                className={`px-4 py-3 font-black ${
                  toNumber(row.netProfit) >= 0
                    ? "text-purple-600"
                    : "text-red-600"
                }`}
              >
                {formatSignedMoney(row.netProfit)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ManualDiscountTable({ rows, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spin />
      </div>
    );
  }

  if (!rows?.length) {
    return <Empty description="No approved manual discount found" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead>
          <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Zone</th>
            <th className="px-4 py-3">Agent</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Note</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row?._id || index} className="border-t border-slate-100">
              <td className="px-4 py-3 font-bold text-slate-800">
                {getDiscountDate(row) || "N/A"}
              </td>

              <td className="px-4 py-3">
                {row?.zoneName || row?.zoneId || row?.zoneID || "N/A"}
              </td>

              <td className="px-4 py-3">
                {row?.agentName || row?.agentPhoneNumber || row?.agentId || "N/A"}
              </td>

              <td className="px-4 py-3 font-black text-red-500">
                -{formatMoney(getDiscountAmount(row))}
              </td>

              <td className="px-4 py-3">{row?.note || row?.reason || "N/A"}</td>

              <td className="px-4 py-3">
                <Tag color="green">{row?.status || "approved"}</Tag>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersModal({ open, onCancel, orders }) {
  return (
    <Modal
      title="Completed Orders in Report"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1200}
    >
      {!orders?.length ? (
        <Empty description="No orders found" />
      ) : (
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Restaurant</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Food</th>
                <th className="px-3 py-3">Delivery</th>
                <th className="px-3 py-3">Tips</th>
                <th className="px-3 py-3">Voucher</th>
                <th className="px-3 py-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-slate-100">
                  <td className="px-3 py-3 text-[11px] font-bold text-blue-600">
                    {order._id}
                  </td>

                  <td className="px-3 py-3 text-slate-500">
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleString("en-BD")
                      : "N/A"}
                  </td>

                  <td className="px-3 py-3">
                    <Tag color="green">{order.status}</Tag>
                  </td>

                  <td className="px-3 py-3 font-bold">
                    {order.restaurantName}
                  </td>

                  <td className="px-3 py-3">{order.customerPhone}</td>

                  <td className="px-3 py-3 capitalize">
                    {order.paymentMethod || "N/A"}
                  </td>

                  <td className="px-3 py-3">{formatMoney(order.foodSale)}</td>

                  <td className="px-3 py-3">
                    {formatMoney(order.deliveryFee)}
                  </td>

                  <td className="px-3 py-3">
                    {formatMoney(order.riderTips)}
                  </td>

                  <td className="px-3 py-3 font-bold text-red-500">
                    -{formatMoney(order.voucherExpense)}
                    {order.voucherCode ? (
                      <div className="text-[10px] text-red-400">
                        {order.voucherCode}
                      </div>
                    ) : null}
                  </td>

                  <td className="px-3 py-3 font-black">
                    {formatMoney(order.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}

function ManualDiscountModal({ open, onCancel, rows }) {
  return (
    <Modal
      title="Approved Manual Discounts"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <ManualDiscountTable rows={rows} loading={false} />
    </Modal>
  );
}

export default ProfitReports;