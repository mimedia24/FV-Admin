import React, { useEffect, useState } from "react";
import Layout from "./layout";
import { AdvancedMarker, Map, Marker, Pin } from "@vis.gl/react-google-maps";
import { FaMapMarkerAlt } from "react-icons/fa";
import axiosInstance from "../services/axios/axiosInstance";
import axios from "axios";
import { apiAuthToken, apiPath } from "../../secrets";
import {
  Button,
  Collapse,
  DatePicker,
  Descriptions,
  Input,
  message,
  Modal,
  Spin,
  Tag,
} from "antd";
import handleApiRequest from "../helpers/handleApiRequest";
import { data } from "autoprefixer";

// fetch data
async function handleGetOrderByDate(date) {
  try {
    const todayTimestamp = new Date(date).getTime();

    const { data } = await axios.get(
      apiPath + `/admin/today-order?type=order&date=${todayTimestamp}`,
      {
        headers: {
          "x-auth-token": apiAuthToken,
        },
      }
    );
    console.log("data: ", data);
    return data;
  } catch (error) {
    console.log("failed to order by date.");
    return null;
  }
} // end of fetch data

function OrderMap() {
  const [orders, setOrders] = useState([]); // orders list
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [date, setDate] = useState(new Date());

  function handleModalOpen(data) {
    setModalData(data);
    setModalOpen(true);
  }
  function handleModalClose() {
    setModalOpen(false);
  }

  function handleDatepicker(date, dateString) {
    handleGetOrderByDate(new Date(dateString)).then((result) =>
      setOrders(result.orders)
    );
  }

  useEffect(() => {
    handleGetOrderByDate(date).then((response) => setOrders(response.orders));
  }, []);

  return (
    <Layout>
      <div className="p-10">
        <h1 className="text-center text-2xl font-bold my-2">Order Map</h1>
        <div className="w-fit mx-auto my-2">
          <DatePicker onChange={handleDatepicker} />
        </div>
        <Map
          style={{ width: "80vw", height: "90vh", margin: "0 auto" }}
          defaultCenter={{ lat: 22.9443, lng: 90.8301 }}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI
          mapId={import.meta.env.VITE_MAP_ID}
        >
          {orders &&
            orders.map((order) => {
              const hasRider = order?.riderId?.length > 5 ? false : true;

              return (
                <AdvancedMarker
                  key={order._id}
                  position={{ lat: order.coords.lat, lng: order.coords.long }}
                  onClick={() => handleModalOpen(order)}
                >
                  <Pin
                    background={hasRider ? "#DB4437" : "#0f9d58"}
                    borderColor={hasRider ? "#8b1c16" : "#006425"}
                    glyphColor={hasRider ? "#ffffff" : "#60d98f"}
                  />
                </AdvancedMarker>
              );
            })}
        </Map>
      </div>

      <OrderModal
        handleOk={handleModalClose}
        handleClose={handleModalClose}
        modalOpen={modalOpen}
        modalData={modalData}
      />
    </Layout>
  );
}

function OrderModal({
  modalOpen,
  handleOk,
  handleClose,
  modalData,
  refreshOrders,
}) {
  const [riderModal, setRiderModal] = useState(false);
  const [riderIdInput, setRiderIdInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!modalData) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success("Copied to clipboard!");
    });
  };

  const handleAssignRider = async () => {
    if (!riderIdInput) {
      message.error("Required Rider ID");
      return;
    }

    // assign new rider
    try {
      const { result, loading } = await handleApiRequest(
        `/rider/assign-rider?orderId=${
          modalData._id
        }&riderId=${riderIdInput.toString()}`,
        {
          method: "PUT",
        }
      );

      console.log("data; ", result);
    } catch (error) {
      console.log(error);
      message.error(error.response.data.message);
    }
  };

  return (
    <>
      <Modal
        title="Order Details"
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleClose}
        width={700}
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Order ID">
            {modalData._id}
          </Descriptions.Item>
          <Descriptions.Item label="User ID">
            {modalData.userId}
          </Descriptions.Item>
          <Descriptions.Item label="Rider ID">
            <span
              style={{ cursor: "pointer", color: "#1890ff" }}
              onClick={() =>
                modalData.riderId && copyToClipboard(modalData.riderId)
              }
            >
              {modalData.riderId}
            </span>

            {modalData.riderId === "" ? (
              <Button className="mx-4" onClick={() => setRiderModal(true)}>
                Assign Rider
              </Button>
            ) : null}
          </Descriptions.Item>
          <Descriptions.Item label="Restaurant">
            {modalData.restaurantName}
          </Descriptions.Item>
          <Descriptions.Item label="Drop Location">
            {modalData.dropLocation}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Phone">
            {modalData.customerPhone}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            <Tag color="blue">{modalData.peymentMethod}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            <Tag
              color={modalData.paymentStatus === "pending" ? "red" : "green"}
            >
              {modalData.paymentStatus}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={modalData.status === "cancelled" ? "red" : "green"}>
              {modalData.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Amount">
            ৳{modalData.totalAmount}
          </Descriptions.Item>
          <Descriptions.Item label="Delivery Fee">
            ৳{modalData.deliveryAmount}
          </Descriptions.Item>
          <Descriptions.Item label="Distance">
            {modalData.distance} km
          </Descriptions.Item>
          <Descriptions.Item label="Order Date">
            {new Date(modalData.orderDate).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        
        {modalData.userRestaurantChat?.length > 0 && (
          <Collapse className="mt-4">
            <h1 className="p-2">User & Restaurant Chat</h1>
            <Collapse.Panel header="Messages" key="1">
              {modalData.userRestaurantChat.map((msg) => (
                <div key={msg._id} className="mb-3 p-2 rounded border">
                  <div className="font-semibold">{msg.senderType}</div>
                  <div>{msg.message}</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(msg.createAt).toLocaleString("bn-BD")}
                  </div>
                </div>
              ))}
            </Collapse.Panel>
          </Collapse>
        )}


            
        {modalData.userRiderChat?.length > 0 && (
          <Collapse className="mt-4">
            <h1 className="p-2">User & Rider Chat</h1>
            <Collapse.Panel header="Messages" key="1">
              {modalData.userRiderChat.map((msg) => (
                <div key={msg._id} className="mb-3 p-2 rounded border">
                  <div className="font-semibold">{msg.senderType}</div>
                  <div>{msg.message}</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(msg.createAt).toLocaleString("bn-BD")}
                  </div>
                </div>
              ))}
            </Collapse.Panel>
          </Collapse>
        )}
      </Modal>

      <Modal
        title="Assign Rider"
        open={riderModal}
        onCancel={() => setRiderModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setRiderModal(false)}>
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            onClick={handleAssignRider}
            disabled={loading}
          >
            {loading ? <Spin size="small" /> : "Assign"}
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter Rider ID"
          value={riderIdInput}
          onChange={(e) => setRiderIdInput(e.target.value)}
        />
      </Modal>
    </>
  );
}

export default OrderMap;
