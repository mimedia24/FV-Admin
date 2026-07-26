import { useEffect, useState } from "react";
import Layout from "./layout";
import RestaurantDetails from "../components/restaurant/restaurantDetails";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/axios/axiosInstance";
import { Table, Tag, Checkbox, Image, message } from "antd";
import PositionUpdate from "../components/restaurant/UpdateRestaurantMenuPosition";
import { resolveImageUrl } from "../helpers/imageUrl";

export default function RestaurantListOfMenu() {
  const [restaurantDetail, setRestaurantDetail] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { id } = useParams();

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/admin/restaurant-menu-list?id=${id}&limit=${limit}&page=${page}`
      );
      if (data?.success) {
        setMenuList(data.menu || []);
        setRestaurantDetail(data.restaurant || null);
        setTotalItems(data.totalItems || 0);
      }
    } catch {
      message.error("Failed to load menu list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
    // fetchMenu uses the current restaurant and pagination values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

  const handleStatusUpdate = async (menuId, field, newValue, endpoint) => {
    try {
      const { data } = endpoint.includes("update-cake")
        ? await axiosInstance.put(endpoint, { isCake: newValue, menuId })
        : await axiosInstance.put(endpoint);

      if (data.success) {
        setMenuList((prev) =>
          prev.map((m) => (m._id === menuId ? { ...m, [field]: newValue } : m))
        );
        message.success(`${field} updated successfully`);
      }
    } catch {
      message.error("Update failed");
    }
  };

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => (page - 1) * limit + (index + 1),
      width: 60,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => (
        <Image
          width={50}
          height={50}
          className="rounded shadow-sm object-cover"
          src={resolveImageUrl(img)}
          fallback={resolveImageUrl()}
        />
      ),
    },
    { title: "Name", dataIndex: "name", className: "font-semibold" },
    {
      title: "Pricing",
      render: (_, record) => (
        <div className="text-xs">
          <div>Base: {record.basedPrice}</div>
          <div className="font-bold text-blue-600">Sell: {record.sellingPrice}</div>
          <div className="text-green-600">Offer: {record.offerPrice}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (cat) => <Tag color="geekblue">{cat?.toUpperCase()}</Tag>,
    },
    {
      title: "Cake?",
      dataIndex: "isCake",
      render: (checked, record) => (
        <Checkbox
          checked={checked}
          onChange={(e) =>
            handleStatusUpdate(record._id, "isCake", e.target.checked, `/admin/update-cake`)
          }
        />
      ),
    },
    {
      title: "Popular",
      dataIndex: "isPopular",
      render: (checked, record) => (
        <Checkbox
          checked={checked}
          onChange={(e) =>
            handleStatusUpdate(record._id, "isPopular", e.target.checked, `/menu/update/popular?status=${e.target.checked}&menuId=${record._id}`)
          }
        />
      ),
    },
    {
      title: "Popular Counter",
      dataIndex: "position",
      width: 120,
      render: (pos, record) => (
        <PositionUpdate 
          menuId={record._id} 
          currentPosition={pos} 
          onUpdateSuccess={fetchMenu} 
        />
      ),
    },
    {
      title: "Approved",
      dataIndex: "isApproved",
      render: (checked, record) => (
        <Checkbox
          checked={checked}
          onChange={(e) =>
            handleStatusUpdate(record._id, "isApproved", e.target.checked, `/menu/update/approval?approvalStatus=${e.target.checked}&menuId=${record._id}`)
          }
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "in stock" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {restaurantDetail?.name || "Restaurant"} Menu Management
          </h1>
          <Tag color="blue" className="px-4 py-1 text-sm font-medium">
            Total Items: {totalItems}
          </Tag>
        </div>

        {restaurantDetail && (
          <div className="mb-8">
            <RestaurantDetails detail={restaurantDetail} totalMenu={totalItems} />
          </div>
        )}

        <Table
          columns={columns}
          dataSource={menuList}
          rowKey="_id"
          loading={loading}
          bordered
          size="middle"
          pagination={{
            current: page,
            pageSize: limit,
            total: totalItems,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            position: ["bottomCenter"],
          }}
        />
      </div>
    </Layout>
  );
}
