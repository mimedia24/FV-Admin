import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import {
  Button,
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
  Badge,
  Tooltip,
} from "antd";
import handleApiRequest from "../helpers/handleApiRequest";
import {
  GOOGLE_MAP_ID,
  hasGoogleMapsConfig,
} from "../config/maps";
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  MessageOutlined, 
  UserOutlined,
  CompassOutlined,
  ShoppingOutlined,
  CheckCircleFilled,
  SyncOutlined
} from "@ant-design/icons";

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
    message.error("Failed to fetch orders.");
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
    if (response) {
      const mappedOrders = (Array.isArray(response.orders) ? response.orders : [])
        .filter((order) => order?.isArchived !== true)
        .filter((order) => {
          const latitude = Number(order?.coords?.lat);
          const longitude = Number(order?.coords?.long ?? order?.coords?.lng);
          return Number.isFinite(latitude) && Number.isFinite(longitude);
        });
      setOrders(mappedOrders);
    }
    setLoading(false);
  };

  useEffect(() => { loadOrders(date); }, []);

  const handleDatepicker = (date, dateString) => {
    const newDate = new Date(dateString);
    setDate(newDate);
    loadOrders(newDate);
  };

  return (
    <Layout>
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-[#f0f2f5]">
        
        {/* Floating Side Control Panel */}
        <div className="absolute top-6 left-6 z-10 w-80 flex flex-col gap-4">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <div className="p-1">
              <div className="flex flex-col mb-4 px-2">
                <Title level={4} className="!m-0 !font-black tracking-tight">Live Fleet</Title>
                <Text type="secondary" className="text-[10px] uppercase font-bold tracking-widest">
                  {orders?.length || 0} Deliveries Active
                </Text>
              </div>
              <DatePicker 
                onChange={handleDatepicker} 
                className="w-full rounded-xl border-slate-100 bg-white/50"
                allowClear={false}
                suffixIcon={<CalendarOutlined className="text-blue-500" />}
              />
            </div>
          </Card>

          {/* Quick Stats Mini Cards */}
          <div className="flex gap-2">
             <div className="flex-1 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white">
                <Text type="secondary" className="block text-[9px] font-bold uppercase">Unassigned</Text>
                <Title level={5} className="!m-0 text-red-500">{orders?.filter(o => !o.riderId).length}</Title>
             </div>
             <div className="flex-1 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white">
                <Text type="secondary" className="block text-[9px] font-bold uppercase">Assigned</Text>
                <Title level={5} className="!m-0 text-emerald-500">{orders?.filter(o => o.riderId).length}</Title>
             </div>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3">
                <SyncOutlined spin className="text-3xl text-blue-600" />
                <Text className="font-bold text-slate-700">Refresing Map...</Text>
            </div>
          </div>
        )}

        {!hasGoogleMapsConfig ? (
          <div className="flex h-full items-center justify-center p-6">
            <Card className="max-w-lg text-center shadow-lg">
              <Title level={4}>Google Maps key is missing</Title>
              <Text type="secondary">
                Add VITE_MAP_API_KEY before building the Main Admin Panel.
              </Text>
            </Card>
          </div>
        ) : (
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={{ lat: 22.9443, lng: 90.8301 }}
          defaultZoom={13}
          mapId={GOOGLE_MAP_ID || undefined}
          disableDefaultUI={true}
        >
          {orders?.map((order) => {
            const noRider = !order.riderId || order.riderId.length < 5;
            return (
              <AdvancedMarker
                key={order._id}
                position={{
                  lat: Number(order.coords.lat),
                  lng: Number(order.coords.long ?? order.coords.lng),
                }}
                onClick={() => { setModalData(order); setModalOpen(true); }}
              >
                <div className="relative flex items-center justify-center">
                    {/* Pulsing Aura */}
                    <div className={`absolute w-10 h-10 rounded-full animate-ping opacity-20 ${noRider ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                    {/* Marker Icon */}
                    <div className={`relative z-10 w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white ${noRider ? 'bg-red-500' : 'bg-emerald-600'}`}>
                        {noRider ? <ShoppingOutlined /> : <CompassOutlined className="animate-pulse" />}
                    </div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
        )}
      </div>

      <OrderModal
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
    if (!riderIdInput) return message.warning("Enter Rider ID");
    setSubmitting(true);
    try {
      await handleApiRequest(`/rider/assign-rider?orderId=${modalData._id}&riderId=${riderIdInput}`, { method: "PUT" });
      message.success("Partner Assigned");
      setRiderModal(false);
      refreshOrders();
      handleClose();
    } catch (error) { message.error("Error updating"); } finally { setSubmitting(false); }
  };

  return (
    <>
      <Modal
        title={null}
        open={modalOpen}
        onCancel={handleClose}
        footer={null}
        width={750}
        centered
        className="modern-order-modal"
      >
        <div className="pt-2">
          {/* Custom Header */}
          <div className="flex justify-between items-start mb-6">
            <Space direction="vertical" size={0}>
              <Text type="secondary" className="text-[10px] uppercase font-black">Ref ID: {modalData._id.toUpperCase()}</Text>
              <Title level={3} className="!m-0 !font-black tracking-tighter">৳{modalData.totalAmount}</Title>
            </Space>
            <div className="text-right">
                <Tag color={modalData.status === "cancelled" ? "red" : "blue"} className="rounded-lg font-bold border-0 px-3 py-1">
                    {modalData.status.toUpperCase()}
                </Tag>
                <div className="text-[10px] text-slate-400 mt-1 font-bold">MODE: {modalData.peymentMethod}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <section>
                    <Text className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Client & Vendor</Text>
                    <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><UserOutlined /></div>
                            <Text strong>{modalData.customerPhone}</Text>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600"><ShoppingOutlined /></div>
                            <Text strong>{modalData.restaurantName}</Text>
                        </div>
                    </div>
                </section>

                <section>
                    <Text className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">Logistics</Text>
                    <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                        <Space direction="vertical" size={0}>
                            <Text className="text-xs text-slate-400">Rider Partner</Text>
                            <Text strong className={!modalData.riderId ? 'text-red-500' : 'text-slate-800'}>
                                {modalData.riderId || "Not Assigned"}
                            </Text>
                        </Space>
                        <Button type="primary" size="small" className="rounded-lg text-[10px] font-bold h-8" onClick={() => setRiderModal(true)}>
                            {modalData.riderId ? 'CHANGE' : 'ASSIGN'}
                        </Button>
                    </div>
                </section>

                <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <EnvironmentOutlined />
                    <span>{modalData.dropLocation}</span>
                </div>
            </div>

            <div className="space-y-4">
                <ChatSection title="Restaurant Chat" messages={modalData.userRestaurantChat} />
                <ChatSection title="Rider Chat" messages={modalData.userRiderChat} />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={<Title level={4} className="!m-0 !font-black">Assign Rider</Title>}
        open={riderModal}
        onCancel={() => setRiderModal(false)}
        onOk={handleAssignRider}
        confirmLoading={submitting}
        okText="Confirm Partner"
        centered
        closeIcon={null}
      >
        <div className="py-4">
            <Input
              prefix={<UserOutlined className="text-blue-500" />}
              placeholder="Enter Rider ID (e.g. RDR-92)"
              value={riderIdInput}
              onChange={(e) => setRiderIdInput(e.target.value)}
              className="py-3 rounded-xl bg-slate-50 border-slate-100"
            />
        </div>
      </Modal>
    </>
  );
}

function ChatSection({ title, messages }) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 h-[240px] flex flex-col shadow-sm">
            <Text className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                <MessageOutlined className="text-blue-500" /> {title}
            </Text>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {messages?.length ? messages.map((msg) => (
                    <div key={msg._id} className={`flex flex-col ${msg.senderType === 'user' ? 'items-start' : 'items-end'}`}>
                        <div className={`px-3 py-2 rounded-2xl text-[11px] max-w-[85%] leading-relaxed ${
                            msg.senderType === 'user' 
                            ? 'bg-slate-100 text-slate-800 rounded-bl-none font-medium' 
                            : 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-100'
                        }`}>
                            {msg.message}
                        </div>
                        <span className="text-[8px] text-slate-300 mt-1 uppercase font-bold tracking-tighter">
                            {new Date(msg.createAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                )) : <div className="h-full flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase italic">No history</div>}
            </div>
        </div>
    );
}

export default OrderMap;
