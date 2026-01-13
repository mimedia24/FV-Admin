import { useEffect, useState } from "react";
import Layout from "./layout";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import { Link, useParams } from "react-router-dom";
import { Table, Tag, Typography, Card, Space, Empty, Spin } from "antd";
import PaymentModalRider from "../components/payment/rider/PaymentModal";
import PaymentModalRestaurant from "../components/payment/restaurant/PaymentModal";
import { WalletOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PaymentManagement() {
  const [riderList, setRiderList] = useState([]);
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { payment } = useParams();

  async function getRiderWalletList() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiPath}/wallet/walletList/list-wallet`, {
        headers: { "x-auth-token": apiAuthToken },
      });
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
      const { data } = await axios.get(`${apiPath}/admin/payment/restaurant/wallet`, {
        headers: { "x-auth-token": apiAuthToken },
      });
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

  // Columns for Rider Table
  const riderColumns = [
    { title: "SL", render: (text, record, index) => index + 1, width: 60 },
    {
      title: "Rider Info",
      render: (_, item) => (
        <Space direction="vertical" size={0}>
          <Text strong>{item?.riderId?.name}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>{item?.riderId?.email}</Text>
        </Space>
      ),
    },
    { title: "ID", dataIndex: ["riderId", "_id"], className: "font-mono text-xs" },
    { title: "Payment No", dataIndex: ["riderId", "paymentNumber"], render: (val) => val || "N/A" },
    {
      title: "Balance",
      dataIndex: "walletBalance",
      render: (val) => <Text strong className="text-lg text-green-600">৳{val}</Text>,
    },
    {
      title: "Status",
      dataIndex: ["riderId", "riderStatus"],
      render: (status) => (
        <Tag color={status === "active" ? "blue" : "red"}>{status?.toUpperCase()}</Tag>
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

  // Columns for Restaurant Table
  const restaurantColumns = [
    { title: "Restaurant Name", dataIndex: "name", render: (text) => <Text strong>{text}</Text> },
    { title: "Phone", dataIndex: "phone" },
    { title: "Address", dataIndex: "address", ellipsis: true },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (val) => <Text strong className="text-lg text-blue-600">৳{val}</Text>,
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
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <header className="text-center mb-8">
          <Title level={2} style={{ color: "#4b5563" }}>
            <WalletOutlined /> Payment Management
          </Title>
          <Text type="secondary">Process payouts and monitor wallet balances</Text>
        </header>

        {/* Navigation Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
            <Link
              to="/payment/rider"
              className={`px-8 py-2 rounded-lg transition-all ${
                payment === "rider" ? "bg-purple-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <UserOutlined /> Rider Payouts
            </Link>
            <Link
              to="/payment/restaurant"
              className={`px-8 py-2 rounded-lg transition-all ${
                payment === "restaurant" ? "bg-purple-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <ShopOutlined /> Restaurant Payouts
            </Link>
          </div>
        </div>

        <Card className="shadow-xl rounded-2xl border-0">
          {!payment ? (
            <div className="py-20 text-center">
              <Empty description="Select a payment category to manage payouts" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between mb-6">
                <Title level={4} className="!m-0 capitalize">
                  {payment} Wallet List
                </Title>
                <Tag color="purple">Total: {payment === "rider" ? riderList.length : restaurantList.length}</Tag>
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <Spin size="large" tip="Fetching Wallet Data..." />
                </div>
              ) : (
                <Table
                  dataSource={payment === "rider" ? riderList : restaurantList}
                  columns={payment === "rider" ? riderColumns : restaurantColumns}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                  className="modern-table"
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}