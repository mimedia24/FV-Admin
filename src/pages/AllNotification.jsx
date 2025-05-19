import React, { useEffect, useState } from "react";
import { apiAuthToken, apiPath } from "../../secrets";
import Layout from "./layout";

function AllNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${apiPath}/notification/notifications`, {
        method: "GET",
        headers: {
          "x-auth-token": apiAuthToken,
        },
      }); // Replace with your real endpoint
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
                src={`data:image/jpeg;base64,${item.image}`}
                alt="Notification"
                className="mt-2 w-full max-h-60 object-cover rounded"
              />
            )}
            <div className="text-sm text-gray-500 mt-1">
              Type: {item.type} | Promotion: {item.isPromotion ? "Yes" : "No"}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default AllNotification;
