import React, { useEffect, useState } from "react";
import Layout from "./layout";
import RestaurantDetails from "../components/restaurant/restaurantDetails";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/axios/axiosInstance";
import { Spin, Table, Tag, Checkbox, Image } from "antd";
import { apiAuthToken, apiPath } from "../../secrets";

export default function RestaurantListOfMenu() {
  const [restaurantDetail, setRestaurantDetail] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/restaurant/list-of-menu?id=${id}`
        );

        if (data?.success) {
          setMenuList(data.menu || []);
          setRestaurantDetail(data.restaurant || null);
        }
      } catch (err) {
        console.error("Error fetching menu: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [id]);

  // ✅ Table Columns
  const columns = [
    {
      title: "SL No",
      key: "slNo",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Thumbnail",
      dataIndex: "image",
      render: (img) => (
        <Image
          width={60}
          height={60}
          className="object-cover rounded-md"
          src={
            img
              ? import.meta.env.VITE_IMAGE_PATH + img
              : "https://placehold.co/100x100"
          }
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => text || "-",
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (desc) => desc || "-",
    },
    {
      title: "Based Price",
      dataIndex: "basedPrice",
      render: (price) => `BDT ${price}`,
    },
    {
      title: "Plateform Fee",
      dataIndex: "plateformFee",
      render: (fee) => `BDT ${fee}`,
    },
    {
      title: "Selling Price",
      dataIndex: "sellingPrice",
      render: (price) => `BDT ${price}`,
    },
    {
      title: "Discount (%)",
      dataIndex: "discountRate",
      render: (rate) => `${rate}%`,
    },
    {
      title: "Offer Price",
      dataIndex: "offerPrice",
      render: (price) => `BDT ${price}`,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "gray";
        if (status === "in stock") color = "blue";
        if (status === "out of stock") color = "orange";
        if (status === "discontinued") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Admin Approval",
      dataIndex: "isApproved",
      render: (_, record) => (
        <Checkbox
          checked={record.isApproved}
          onChange={async () => {
            try {
              const res = await fetch(
                `${apiPath}/menu/update/approval?approvalStatus=${!record.isApproved}&menuId=${record._id}`,
                {
                  method: "PUT",
                  headers: { "x-auth-token": apiAuthToken },
                }
              );
              const data = await res.json();
              if (data.success) {
                setMenuList((prev) =>
                  prev.map((m) =>
                    m._id === record._id
                      ? { ...m, isApproved: !record.isApproved }
                      : m
                  )
                );
              }
            } catch (err) {
              console.error("Error updating approval: ", err);
            }
          }}
        />
      ),
    },
    {
      title: "Popular",
      dataIndex: "isPopular",
      render: (_, record) => (
        <Checkbox
          checked={record.isPopular}
          onChange={async () => {
            try {
              const res = await fetch(
                `${apiPath}/menu/update/popular?status=${!record.isPopular}&menuId=${record._id}`,
                {
                  method: "PUT",
                  headers: { "x-auth-token": apiAuthToken },
                }
              );
              const data = await res.json();
              if (data.success) {
                setMenuList((prev) =>
                  prev.map((m) =>
                    m._id === record._id
                      ? { ...m, isPopular: !record.isPopular }
                      : m
                  )
                );
              }
            } catch (err) {
              console.error("Error updating popular: ", err);
            }
          }}
        />
      ),
    },
  ];

  return (
    <Layout>
      <div className="w-full px-6 py-6">
        <h1 className="text-3xl text-center font-bold text-gray-700 mb-6">
          {restaurantDetail?.name || "Restaurant"} Menu
        </h1>

        {/* Restaurant Info */}
        {restaurantDetail && (
          <div className="mb-6">
            <RestaurantDetails
              detail={restaurantDetail}
              totalMenu={menuList?.length}
            />
          </div>
        )}

        {/* Menu Table */}
        <Spin spinning={loading} tip="Loading menus...">
          <Table
            columns={columns}
            dataSource={menuList}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            bordered
          />
        </Spin>
      </div>
    </Layout>
  );
}
