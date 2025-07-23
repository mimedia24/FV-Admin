import React, { useEffect, useState } from "react";
import { apiAuthToken, apiPath } from "../../secrets";
import Layout from "./layout";
import { Button } from "antd";

function AllNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_PATH}/notification/notifications?limit=5`,
        {
          method: "GET",
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      ); // Replace with your real endpoint
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        alert(data.message || "Failed to load notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    return () => console.log("component unmount.");
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading notifications...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600">
        No notifications found.
      </div>
    );
  }

  async function handleDelete(id) {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_PATH}/notification/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert("Failedt to delete notification.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      fetchNotifications();
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          All Notifications
        </h1>
        {notifications.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-gray-700">{item.description}</p>
            {item.image && (
              <img
                src={import.meta.env.VITE_IMAGE_PATH + item.image}
                alt="Notification"
                className="mt-2 w-full max-h-60 object-cover rounded"
              />
            )}
            <div className="text-sm text-gray-500 mt-1">
              Type: {item.type} | Promotion: {item.isPromotion ? "Yes" : "No"}
            </div>

            <Button
              color="danger"
              onClick={() => {
                const userConfirm = confirm("Are you sure?");
                if (userConfirm) {
                  handleDelete(item._id);
                } else {
                  console.log("Cancel delete request.");
                }
              }}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default AllNotification;
