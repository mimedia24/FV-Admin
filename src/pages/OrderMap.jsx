import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import {
  Button,
  Collapse,
  Descriptions,
  Input,
  message,
  Modal,
  Spin,
  Tag,
  DatePicker,
  Card,
  Typography,
  Space,
} from "antd";
import handleApiRequest from "../helpers/handleApiRequest";
import { CalendarOutlined, EnvironmentOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

async function handleGetOrderByDate(date) {
  try {
    const todayTimestamp = new Date(date).getTime();
    const { data } = await axios.get(
      `${apiPath}/admin/today-order?type=order&date=${todayTimestamp}`,
      { headers: { "x-auth-token": apiAuthToken } }
    );
    return data;
  } catch (error) {
    message.error("Failed to fetch orders for this date.");
    return null;
  }
}

function OrderMap() {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const loadOrders = async (targetDate) => {
    setLoading(true);
    const response = await handleGetOrderByDate(targetDate);
    if (response) setOrders(response.orders);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders(date);
  }, []);

  const handleDatepicker = (date, dateString) => {
    const newDate = new Date(dateString);
    setDate(newDate);
    loadOrders(newDate);
  };

  return (
    <Layout>
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
        {/* Floating Header Panel */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md rounded-2xl">
            <div className="flex items-center justify-between">
              <Space direction="vertical" size={0}>
                <Title level={4} className="!m-0">Live Order Tracker</Title>
                <Text type="secondary" className="text-xs">Monitoring {orders?.length || 0} active deliveries</Text>
              </Space>
              <DatePicker 
                onChange={handleDatepicker} 
                className="rounded-lg border-gray-200"
                allowClear={false}
                placeholder="Filter by date"
              />
            </div>
          </Card>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center">
            <Spin size="large" tip="Loading Map Data..." />
          </div>
        )}

        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={{ lat: 22.9443, lng: 90.8301 }}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId={import.meta.env.VITE_MAP_ID}
        >
          {orders?.map((order) => {
            const noRider = !order.riderId || order.riderId.length < 5;
            return (
              <AdvancedMarker
                key={order._id}
                position={{ lat: order.coords.lat, lng: order.coords.long }}
                onClick={() => {
                    setModalData(order);
                    setModalOpen(true);
                }}
              >
                <Pin
                  background={noRider ? "#FF4D4F" : "#52C41A"}
                  borderColor={noRider ? "#A8071A" : "#237804"}
                  glyphColor={"#FFFFFF"}
                  scale={1.2}
                />
              </AdvancedMarker>
            );
          })}
        </Map>
      </div>

      <OrderModal
        handleOk={() => setModalOpen(false)}
        handleClose={() => setModalOpen(false)}
        modalOpen={modalOpen}
        modalData={modalData}
        refreshOrders={() => loadOrders(date)}
      />
    </Layout>
  );
}

function OrderModal({ modalOpen, handleClose, modalData, refreshOrders }) {
  const [riderModal, setRiderModal] = useState(false);
  const [riderIdInput, setRiderIdInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!modalData) return null;

  const handleAssignRider = async () => {
    if (!riderIdInput) return message.warning("Please enter a Rider ID");
    setSubmitting(true);
    try {
      const response = await handleApiRequest(
        `/rider/assign-rider?orderId=${modalData._id}&riderId=${riderIdInput}`,
        { method: "PUT" }
      );
      message.success("Rider assigned successfully");
      setRiderModal(false);
      refreshOrders();
      handleClose();
    } catch (error) {
      message.error(error?.response?.data?.message || "Assignment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-blue-500" />
            <span>Order Reference: {modalData._id.slice(-6).toUpperCase()}</span>
          </div>
        }
        open={modalOpen}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose} className="rounded-lg">Close</Button>,
          <Button key="assign" type="primary" className="rounded-lg" onClick={() => setRiderModal(true)}>
            Update Rider
          </Button>
        ]}
        width={800}
        centered
        className="modern-modal"
      >
        <div className="flex flex-col gap-6">
          {/* Top Status Bar */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <Space direction="vertical" size={0}>
              <Text type="secondary" className="text-[10px] uppercase font-bold tracking-wider">Payment Method</Text>
              <Tag color="gold" className="m-0 uppercase font-bold">{modalData.peymentMethod}</Tag>
            </Space>
            <Space direction="vertical" size={0} align="end">
              <Text type="secondary" className="text-[10px] uppercase font-bold tracking-wider">Order Status</Text>
              <Tag color={modalData.status === "cancelled" ? "red" : "green"} className="m-0 uppercase font-bold">
                {modalData.status}
              </Tag>
            </Space>
          </div>

          <Descriptions bordered column={2} size="small" className="overflow-hidden rounded-xl">
            <Descriptions.Item label={<><UserOutlined /> Customer</>}>{modalData.customerPhone}</Descriptions.Item>
            <Descriptions.Item label="Total Amount"><Text strong className="text-green-600">৳{modalData.totalAmount}</Text></Descriptions.Item>
            <Descriptions.Item label="Restaurant" span={2}>{modalData.restaurantName}</Descriptions.Item>
            <Descriptions.Item label="Drop Location" span={2}><Text className="text-gray-600">{modalData.dropLocation}</Text></Descriptions.Item>
            <Descriptions.Item label="Rider ID">
                {modalData.riderId ? <Tag color="blue" onClick={() => {
                     navigator.clipboard.writeText(modalData.riderId);
                     message.success("Copied!");
                }} className="cursor-pointer">{modalData.riderId}</Tag> : <Text type="danger">Unassigned</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Distance">{modalData.distance} km</Descriptions.Item>
          </Descriptions>

          {/* Improved Chat Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <ChatCollapse title="Customer & Restaurant" messages={modalData.userRestaurantChat} />
             <ChatCollapse title="Customer & Rider" messages={modalData.userRiderChat} />
          </div>
        </div>
      </Modal>

      <Modal
        title="Assign Logistics Partner"
        open={riderModal}
        onCancel={() => setRiderModal(false)}
        onOk={handleAssignRider}
        confirmLoading={submitting}
        okText="Assign Now"
        centered
      >
        <div className="py-4">
            <Text type="secondary" className="block mb-2">Enter the unique ID of the rider for this delivery:</Text>
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="e.g. RIDER_9921"
              value={riderIdInput}
              onChange={(e) => setRiderIdInput(e.target.value)}
              className="py-2 rounded-lg"
            />
        </div>
      </Modal>
    </>
  );
}

function ChatCollapse({ title, messages }) {
    if (!messages?.length) return null;
    return (
        <Card size="small" className="bg-gray-50 border-gray-200">
            <div className="flex items-center gap-2 mb-3 font-bold text-gray-700">
                <MessageOutlined /> {title}
            </div>
            <div className="max-h-[200px] overflow-y-auto pr-2">
                {messages.map((msg) => (
                    <div key={msg._id} className={`mb-3 flex flex-col ${msg.senderType === 'user' ? 'items-start' : 'items-end'}`}>
                        <div className={`p-2 rounded-xl text-xs max-w-[90%] ${msg.senderType === 'user' ? 'bg-white text-gray-800 rounded-tl-none border shadow-sm' : 'bg-blue-500 text-white rounded-tr-none'}`}>
                            {msg.message}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-1">
                            {new Date(msg.createAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export default OrderMap;