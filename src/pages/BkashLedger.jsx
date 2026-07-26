import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  DatePicker,
  Empty,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  BankOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import Layout from "./layout";
import axiosInstance from "../services/axios/axiosInstance";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const formatMoney = (value) =>
  `BDT ${Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const getZoneList = (payload) => {
  const rows =
    payload?.result?.data ||
    payload?.result ||
    payload?.data ||
    payload?.zones ||
    [];
  return Array.isArray(rows) ? rows : [];
};

const escapeCsv = (value) =>
  `"${String(value ?? "").replaceAll('"', '""')}"`;

const getOrderDate = (order) =>
  order?.orderDate || order?.createdAt || order?.updateTime || null;

const getBangladeshDateKey = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getOrderPaymentMethod = (order) =>
  String(
    order?.peymentMethod ||
      order?.paymentMethod ||
      order?.payementMethod ||
      ""
  ).trim();

const isBkashOrder = (order) =>
  /bkash|b-kash/i.test(getOrderPaymentMethod(order));

const buildHistoricalOrderLedger = ({
  orders,
  restaurants,
  zoneId,
  dateRange,
  page,
  limit,
}) => {
  const restaurantMap = new Map(
    (restaurants || []).map((restaurant) => [
      String(restaurant?._id || ""),
      restaurant,
    ])
  );
  const startDate = dateRange?.[0]?.format("YYYY-MM-DD") || null;
  const endDate = dateRange?.[1]?.format("YYYY-MM-DD") || null;
  const transactions = orders
    .filter(isBkashOrder)
    .filter((order) => {
      const restaurant =
        restaurantMap.get(String(order?.restaurantId || "")) || {};
      const orderZoneId =
        Number(restaurant.zoneId || order?.zoneId || 0) || null;
      if (zoneId && Number(zoneId) !== orderZoneId) return false;
      if (!startDate || !endDate) return true;
      const dateKey = getBangladeshDateKey(getOrderDate(order));
      return dateKey && dateKey >= startDate && dateKey <= endDate;
    })
    .map((order) => {
      const restaurant =
        restaurantMap.get(String(order?.restaurantId || "")) || {};
      const amount = Number(order?.totalAmount || 0);
      const successful =
        String(order?.paymentStatus || "").toLowerCase() !== "failed";
      return {
        _id: `historical-${order._id}`,
        paymentID: order.paymentId || "",
        trxID: order.trxID || "",
        orderId: order._id,
        restaurantId: order.restaurantId,
        restaurantName:
          order.restaurantName || restaurant.name || "Unknown Restaurant",
        customerPhone: order.customerPhone || "",
        paymentMethod: getOrderPaymentMethod(order) || "bkash",
        orderStatus: order.status || "",
        status: successful ? "HISTORICAL_PAID_ORDER" : "FAILED",
        successful,
        grossAmount: amount,
        amount,
        merchantFee: 0,
        netAmount: amount,
        zoneId: Number(restaurant.zoneId || order.zoneId || 0) || null,
        zoneName:
          restaurant.zoneName ||
          order.zoneName ||
          order.zone ||
          (restaurant.zoneId || order.zoneId
            ? `Zone ${restaurant.zoneId || order.zoneId}`
            : "Legacy/Unknown"),
        zoneSource: restaurant.zoneId
          ? "RESTAURANT"
          : order.zoneId
          ? "ORDER_SNAPSHOT"
          : "UNKNOWN",
        source: "HISTORICAL_ORDER",
        createdAt: getOrderDate(order),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

  const zoneMap = new Map();
  for (const row of transactions) {
    const key = row.zoneId == null ? "legacy" : String(row.zoneId);
    if (!zoneMap.has(key)) {
      zoneMap.set(key, {
        zoneId: row.zoneId,
        zoneName: row.zoneName,
        transactionCount: 0,
        successfulCount: 0,
        grossAmount: 0,
        merchantFee: 0,
        netAmount: 0,
      });
    }
    const zone = zoneMap.get(key);
    zone.transactionCount += 1;
    if (row.successful) {
      zone.successfulCount += 1;
      zone.grossAmount += row.grossAmount;
      zone.netAmount += row.netAmount;
    }
  }
  const zoneRows = [...zoneMap.values()];
  const summary = zoneRows.reduce(
    (acc, zone) => ({
      transactionCount: acc.transactionCount + zone.transactionCount,
      successfulCount: acc.successfulCount + zone.successfulCount,
      grossAmount: acc.grossAmount + zone.grossAmount,
      merchantFee: acc.merchantFee + zone.merchantFee,
      netAmount: acc.netAmount + zone.netAmount,
    }),
    {
      transactionCount: 0,
      successfulCount: 0,
      grossAmount: 0,
      merchantFee: 0,
      netAmount: 0,
    }
  );
  const start = (page - 1) * limit;

  return {
    summary,
    zones: zoneRows,
    transactions: transactions.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: transactions.length,
      totalPages: Math.ceil(transactions.length / limit),
    },
    range: {
      startDate,
      endDate,
      allDates: !startDate && !endDate,
      timezone: "Asia/Dhaka",
    },
  };
};

function BkashLedger() {
  const initialLoadRef = useRef(false);
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState(undefined);
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sourceMode, setSourceMode] = useState("server");
  const [report, setReport] = useState({
    summary: {},
    zones: [],
    transactions: [],
    pagination: { page: 1, limit: 50, total: 0 },
    range: {},
  });

  const fetchZones = async () => {
    try {
      const { data } = await axiosInstance.get(
        "/v3/master-admin/zone/list"
      );
      setZones(getZoneList(data));
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to load zones."
      );
    }
  };

  const fetchLedger = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: report.pagination.limit || 50,
      };
      if (zoneId) params.zoneId = zoneId;
      if (dateRange?.[0] && dateRange?.[1]) {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }

      const { data } = await axiosInstance.get(
        "/v3/master-admin/bkash/summary",
        { params }
      );
      setReport({
        summary: data?.summary || {},
        zones: Array.isArray(data?.zones) ? data.zones : [],
        transactions: Array.isArray(data?.transactions)
          ? data.transactions
          : [],
        pagination: data?.pagination || {
          page,
          limit: 50,
          total: 0,
        },
        range: data?.range || {},
      });
      setSourceMode("server");
    } catch (error) {
      const isMissingLedgerEndpoint =
        error?.response?.status === 404 &&
        /Cannot GET/i.test(String(error?.response?.data?.message || ""));

      if (!isMissingLedgerEndpoint) {
        message.error(
          error?.response?.data?.message || "Failed to load bKash ledger."
        );
        return;
      }

      try {
        const allOrders = [];
        const allRestaurants = [];
        let orderPage = 1;
        let totalPages = 1;
        do {
          const { data } = await axiosInstance.get("/admin/list-of-orders", {
            params: { page: orderPage, limit: 200 },
          });
          allOrders.push(...(Array.isArray(data?.orders) ? data.orders : []));
          totalPages = Math.max(1, Number(data?.totalPages || 1));
          orderPage += 1;
        } while (orderPage <= totalPages);

        let restaurantPage = 1;
        let restaurantPages = 1;
        do {
          const { data } = await axiosInstance.get(
            "/admin/list-of-restaurants",
            {
              params: { page: restaurantPage, limit: 200 },
            }
          );
          allRestaurants.push(
            ...(Array.isArray(data?.restaurants) ? data.restaurants : [])
          );
          restaurantPages = Math.max(1, Number(data?.totalPages || 1));
          restaurantPage += 1;
        } while (restaurantPage <= restaurantPages);

        setReport(
          buildHistoricalOrderLedger({
            orders: allOrders,
            restaurants: allRestaurants,
            zoneId,
            dateRange,
            page,
            limit: report.pagination.limit || 50,
          })
        );
        setSourceMode("historical-fallback");
      } catch (fallbackError) {
        if (fallbackError?.response?.status === 404) {
          setReport({
            summary: {},
            zones: [],
            transactions: [],
            pagination: { page: 1, limit: 50, total: 0 },
            range: {
              allDates: true,
              timezone: "Asia/Dhaka",
            },
          });
          setSourceMode("historical-fallback");
        } else {
          message.error(
            fallbackError?.response?.data?.message ||
              "Failed to load historical bKash orders."
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    fetchZones();
    fetchLedger(1);
    // Initial load only; filter changes are applied explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failedCount = useMemo(
    () =>
      Math.max(
        0,
        Number(report.summary.transactionCount || 0) -
          Number(report.summary.successfulCount || 0)
      ),
    [report.summary]
  );

  const exportCsv = () => {
    const header = [
      "Payment ID",
      "Trx ID",
      "Zone ID",
      "Zone Name",
      "Gross Amount",
      "Merchant Fee",
      "Net Amount",
      "Status",
      "Order ID",
      "Created At",
      "Restaurant",
      "Customer Phone",
      "Order Status",
      "Source",
    ];
    const rows = report.transactions.map((row) => [
      row.paymentID,
      row.trxID,
      row.zoneId,
      row.zoneName,
      row.grossAmount ?? row.amount,
      row.merchantFee,
      row.netAmount ?? row.amount,
      row.status,
      row.orderId,
      row.createdAt || row.createAt,
      row.restaurantName,
      row.customerPhone,
      row.orderStatus,
      row.source,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `bkash-zone-ledger-${
      report.range.startDate || "all"
    }-to-${report.range.endDate || "all"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const zoneColumns = [
    {
      title: "Zone",
      render: (_, row) => (
        <Space direction="vertical" size={0}>
          <Text strong>{row.zoneName}</Text>
          <Text type="secondary">Zone #{row.zoneId ?? "Legacy"}</Text>
        </Space>
      ),
    },
    {
      title: "Payments",
      dataIndex: "transactionCount",
      render: (value) => Number(value || 0).toLocaleString("en-BD"),
    },
    {
      title: "Successful",
      dataIndex: "successfulCount",
      render: (value) => <Tag color="success">{value || 0}</Tag>,
    },
    {
      title: "Gross Received",
      dataIndex: "grossAmount",
      render: (value) => (
        <Text strong className="text-blue-600">
          {formatMoney(value)}
        </Text>
      ),
    },
    {
      title: "Merchant Fee",
      dataIndex: "merchantFee",
      render: formatMoney,
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      render: (value) => (
        <Text strong className="text-emerald-600">
          {formatMoney(value)}
        </Text>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: "Payment",
      render: (_, row) => (
        <Space direction="vertical" size={0}>
          <Text copyable className="font-mono text-xs">
            {row.paymentID || "N/A"}
          </Text>
          <Text type="secondary" className="font-mono text-xs">
            Trx: {row.trxID || "Pending"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Zone",
      render: (_, row) => (
        <Tag color={row.zoneId ? "blue" : "default"}>
          {row.zoneName || (row.zoneId ? `Zone ${row.zoneId}` : "Legacy/Unknown")}
        </Tag>
      ),
    },
    {
      title: "Amount",
      render: (_, row) => (
        <Text strong>{formatMoney(row.grossAmount ?? row.amount)}</Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, row) => {
        const successful =
          Boolean(row.successful) ||
          /completed|success|executed|paid/i.test(status || "");
        return (
          <Tag color={successful ? "success" : "warning"}>
            {status || "UNKNOWN"}
          </Tag>
        );
      },
    },
    {
      title: "Restaurant / Customer",
      render: (_, row) => (
        <Space direction="vertical" size={0}>
          <Text strong>{row.restaurantName || "Unknown Restaurant"}</Text>
          <Text type="secondary">{row.customerPhone || "No phone"}</Text>
        </Space>
      ),
    },
    {
      title: "Order",
      render: (_, row) =>
        row.orderId ? (
          <Space direction="vertical" size={0}>
            <Text copyable className="font-mono text-xs">
              {row.orderId}
            </Text>
            <Tag>{row.orderStatus || "N/A"}</Tag>
          </Space>
        ) : (
          "Not created"
        ),
    },
    {
      title: "Record Source",
      dataIndex: "source",
      render: (value) =>
        value ? (
          <Tag color={value === "HISTORICAL_ORDER" ? "purple" : "blue"}>
            {value === "HISTORICAL_ORDER" ? "ORDER HISTORY" : "PAYMENT RECORD"}
          </Tag>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Time",
      render: (_, row) => {
        const date = row.createdAt || row.createAt;
        return date
          ? new Date(date).toLocaleString("en-BD", {
              timeZone: "Asia/Dhaka",
            })
          : "N/A";
      },
    },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-[1550px] space-y-6">
        <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-600 shadow-lg shadow-pink-950">
                <WalletOutlined className="text-3xl" />
              </div>
              <div>
                <Text className="text-xs font-black uppercase tracking-[0.22em] !text-pink-300">
                  Single Merchant Reconciliation
                </Text>
                <Title level={2} className="!mb-1 !mt-2 !text-white">
                  bKash Zone Ledger
                </Title>
                <Text className="!text-slate-300">
                  See exactly how much bKash money came from every FoodVerse
                  zone.
                </Text>
              </div>
            </div>
            <Space wrap>
              <Tag color={sourceMode === "server" ? "success" : "warning"}>
                {sourceMode === "server"
                  ? "Payment + Order Reconciled"
                  : "Historical Order Compatibility"}
              </Tag>
              <Button
                icon={<DownloadOutlined />}
                onClick={exportCsv}
                disabled={!report.transactions.length}
              >
                Export CSV
              </Button>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => fetchLedger(1)}
                loading={loading}
                className="!bg-pink-600"
              >
                Refresh
              </Button>
            </Space>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_auto]">
            <Select
              value={zoneId}
              onChange={setZoneId}
              allowClear
              placeholder="All zones"
              size="large"
              options={zones.map((zone) => ({
                value: Number(zone.id),
                label: `#${zone.id} ${zone.name}`,
              }))}
            />
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="YYYY-MM-DD"
              size="large"
              className="w-full"
            />
            <Button
              type="primary"
              onClick={() => fetchLedger(1)}
              size="large"
            >
              Apply Filter
            </Button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <SafetyCertificateOutlined />
            Server timezone: {report.range.timezone || "Asia/Dhaka"} · Range:{" "}
            {report.range.allDates
              ? "All available dates"
              : `${report.range.startDate || "N/A"} to ${
                  report.range.endDate || "N/A"
                }`}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Total Payments"
            value={report.summary.transactionCount || 0}
            icon={<BankOutlined />}
          />
          <MetricCard
            label="Successful"
            value={report.summary.successfulCount || 0}
            tone="green"
          />
          <MetricCard label="Failed / Pending" value={failedCount} tone="amber" />
          <MetricCard
            label="Gross Received"
            value={formatMoney(report.summary.grossAmount)}
            tone="blue"
          />
          <MetricCard
            label="Net Received"
            value={formatMoney(report.summary.netAmount)}
            tone="green"
          />
        </div>

        <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <Title level={4} className="!m-0">
              Zone Summary
            </Title>
            <Text type="secondary">
              Reconciled amount grouped by the restaurant&apos;s trusted zone.
            </Text>
          </div>
          <Table
            columns={zoneColumns}
            dataSource={report.zones}
            rowKey={(row) => String(row.zoneId ?? "legacy")}
            loading={loading}
            pagination={false}
            scroll={{ x: 850 }}
            locale={{ emptyText: <Empty description="No bKash payment found" /> }}
          />
        </section>

        <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <Title level={4} className="!m-0">
              Transaction Directory
            </Title>
            <Text type="secondary">
              Payment ID, bKash TrxID, zone, amount and linked FoodVerse order.
            </Text>
          </div>
          <Table
            columns={transactionColumns}
            dataSource={report.transactions}
            rowKey={(row) => row._id || row.paymentID}
            loading={loading}
            scroll={{ x: 1050 }}
            locale={{ emptyText: <Empty description="No transaction found" /> }}
            pagination={{
              current: Number(report.pagination.page || 1),
              pageSize: Number(report.pagination.limit || 50),
              total: Number(report.pagination.total || 0),
              showSizeChanger: false,
              onChange: fetchLedger,
            }}
          />
        </section>
      </div>
    </Layout>
  );
}

function MetricCard({ label, value, tone = "slate", icon }) {
  const tones = {
    slate: "border-slate-200 bg-white text-slate-900",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  };
  return (
    <div className={`rounded-2xl border p-5 ${tones[tone] || tones.slate}`}>
      <div className="flex items-center justify-between gap-3">
        <Text className="text-xs font-black uppercase tracking-[0.16em] text-current">
          {label}
        </Text>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-black">{value}</div>
    </div>
  );
}

export default BkashLedger;
