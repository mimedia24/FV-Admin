import { useEffect, useMemo, useState } from "react";
import Layout from "./layout";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  Tag,
  Typography,
  Card,
  Space,
  Empty,
  Spin,
  Button,
} from "antd";
import PaymentModalRider from "../components/payment/rider/PaymentModal";
import PaymentModalRestaurant from "../components/payment/restaurant/PaymentModal";
import {
  WalletOutlined,
  ShopOutlined,
  UserOutlined,
  DollarCircleOutlined,
  ReloadOutlined,
  BankOutlined,
  CreditCardOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const statThemes = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-600",
    border: "border-blue-200",
    glow: "shadow-[0_10px_40px_rgba(37,99,235,0.10)]",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-600",
    border: "border-emerald-200",
    glow: "shadow-[0_10px_40px_rgba(16,185,129,0.10)]",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-600",
    border: "border-amber-200",
    glow: "shadow-[0_10px_40px_rgba(245,158,11,0.10)]",
  },
  violet: {
    iconBg: "bg-violet-500/10",
    iconText: "text-violet-600",
    border: "border-violet-200",
    glow: "shadow-[0_10px_40px_rgba(139,92,246,0.10)]",
  },
};

function StatCard({ icon, label, value, helper, color = "blue" }) {
  const theme = statThemes[color] || statThemes.blue;

  return (
    <div
      className={`rounded-[24px] border bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${theme.border} ${theme.glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>
          <div className="text-3xl font-black leading-none text-slate-900">
            {value}
          </div>
          <div className="mt-3 text-sm text-slate-500">{helper}</div>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${theme.iconBg} ${theme.iconText}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

const money = (value) =>
  `৳${Math.trunc(Number(value || 0)).toLocaleString("en-BD")}`;

export default function PaymentManagement() {
  const [riderList, setRiderList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { payment } = useParams();

  async function getRiderWalletList() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiPath}/wallet/walletList/list-wallet`,
        {
          headers: { "x-auth-token": apiAuthToken },
        }
      );
      if (data.success) setRiderList(data.wallet);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getRestaurantWalletList() {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${apiPath}/admin/payment/restaurant/wallet`,
        {
          headers: { "x-auth-token": apiAuthToken },
        }
      );
      if (data.success) setRestaurantList(data.restaurant);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRiderWalletList();
    getRestaurantWalletList();
  }, []);

  const handleRefresh = async () => {
    if (payment === "rider") {
      await getRiderWalletList();
    } else if (payment === "restaurant") {
      await getRestaurantWalletList();
    } else {
      await Promise.all([getRiderWalletList(), getRestaurantWalletList()]);
    }
  };

  const riderTotalBalance = useMemo(() => {
    return riderList.reduce(
      (sum, item) => sum + Number(item?.walletBalance || 0),
      0
    );
  }, [riderList]);

  const restaurantTotalBalance = useMemo(() => {
    return restaurantList.reduce(
      (sum, item) => sum + Number(item?.balance || 0),
      0
    );
  }, [restaurantList]);

  const activeViewCount =
    payment === "rider"
      ? riderList.length
      : payment === "restaurant"
      ? restaurantList.length
      : 0;

  const riderColumns = [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      width: 60,
    },
    {
      title: "Rider Info",
      render: (_, item) => (
        <Space direction="vertical" size={0}>
          <Text strong>{item?.riderId?.name}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {item?.riderId?.email}
          </Text>
        </Space>
      ),
    },
    {
      title: "ID",
      dataIndex: ["riderId", "_id"],
      className: "font-mono text-xs",
    },
    {
      title: "Payment No",
      dataIndex: ["riderId", "paymentNumber"],
      render: (val) => val || "N/A",
    },
    {
      title: "Balance",
      dataIndex: "walletBalance",
      render: (val) => (
        <Text strong className="text-lg text-green-600">
          {money(val)}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: ["riderId", "riderStatus"],
      render: (status) => (
        <Tag color={status === "active" ? "blue" : "red"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <PaymentModalRider
          riderId={item?.riderId?._id}
          getRiderWalletList={getRiderWalletList}
        />
      ),
    },
  ];

  const restaurantColumns = [
    {
      title: "Restaurant Name",
      dataIndex: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    { title: "Phone", dataIndex: "phone" },
    { title: "Address", dataIndex: "address", ellipsis: true },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (val) => (
        <Text strong className="text-lg text-blue-600">
          {money(val)}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, item) => (
        <PaymentModalRestaurant
          restaurantId={item._id}
          getRestaurantWallet={getRestaurantWalletList}
        />
      ),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-3 md:p-6">
        <div className="mx-auto max-w-[1550px]">
          {/* Header */}
          <div className="relative mb-8 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50" />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-500 text-white shadow-lg shadow-blue-200/50">
                  <WalletOutlined className="text-[28px]" />
                </div>

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-500">
                    <DollarCircleOutlined />
                    Wallet & Payout Control
                  </div>

                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#0f172a",
                      fontWeight: 800,
                      lineHeight: 1.15,
                    }}
                  >
                    Payment Management
                  </Title>

                  <Text className="text-slate-500 text-sm md:text-base">
                    Process payouts and monitor rider and restaurant wallet
                    balances from one premium admin panel.
                  </Text>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                  className="!h-11 !rounded-xl !border-slate-200 !text-slate-700 !font-semibold"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<UserOutlined />}
              label="Rider Wallets"
              value={riderList.length}
              helper="Total rider payout accounts"
              color="blue"
            />
            <StatCard
              icon={<ShopOutlined />}
              label="Restaurant Wallets"
              value={restaurantList.length}
              helper="Total restaurant payout accounts"
              color="emerald"
            />
            <StatCard
              icon={<CreditCardOutlined />}
              label="Rider Balance"
              value={money(riderTotalBalance)}
              helper="Combined rider wallet balance"
              color="amber"
            />
            <StatCard
              icon={<BankOutlined />}
              label="Restaurant Balance"
              value={money(restaurantTotalBalance)}
              helper="Combined restaurant wallet balance"
              color="violet"
            />
          </div>

          {/* Switcher */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              <Link
                to="/payment/rider"
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
                  payment === "rider"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <UserOutlined /> Rider Payouts
              </Link>

              <Link
                to="/payment/restaurant"
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
                  payment === "restaurant"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <ShopOutlined /> Restaurant Payouts
              </Link>
            </div>
          </div>

          {/* Main Table Card */}
          <Card className="overflow-hidden rounded-[28px] border border-slate-200 shadow-sm">
            {!payment ? (
              <div className="py-20 text-center">
                <Empty description="Select a payment category to manage payouts" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <Title level={4} className="!m-0 capitalize">
                      {payment} Wallet List
                    </Title>
                    <Text className="text-slate-500">
                      Review balances and process payouts for{" "}
                      {payment === "rider" ? "riders" : "restaurants"}.
                    </Text>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600">
                      Total: {activeViewCount}
                    </div>
                    <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                      Type: {payment}
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="py-20 text-center">
                    <Spin size="large" tip="Fetching Wallet Data..." />
                  </div>
                ) : (
                  <Table
                    dataSource={payment === "rider" ? riderList : restaurantList}
                    columns={
                      payment === "rider" ? riderColumns : restaurantColumns
                    }
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    className="modern-table"
                  />
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}