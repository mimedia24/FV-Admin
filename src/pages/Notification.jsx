import React, { useState } from "react";
import Layout from "./layout";
import { apiAuthToken, apiPath } from "../../secrets";
import { Link } from "react-router-dom";

function Notification() {
  // State for Promotional Notification form (with image)
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDescription, setPromoDescription] = useState("");
  const [promoImage, setPromoImage] = useState(null);
  const [promoIsPromotion, setPromoIsPromotion] = useState(true); // Always true for this form
  const [promoType, setPromoType] = useState("public");

  // State for General Post form (without image)
  const [generalTitle, setGeneralTitle] = useState("");
  const [generalDescription, setGeneralDescription] = useState("");
  const [generalIsPromotion, setGeneralIsPromotion] = useState(false); // Always false for this form
  const [generalType, setGeneralType] = useState("public");

  // --- Handle Submit for Promotional Notification (with Image) ---
  const handlePromotionalSubmit = async (e) => {
    e.preventDefault();

    if (!promoImage) {
      alert("Please select an image for promotional notifications.");
      return;
    }

    const formData = new FormData();
    formData.append("title", promoTitle);
    formData.append("description", promoDescription);
    formData.append("isPromotion", promoIsPromotion);
    formData.append("type", promoType);
    formData.append("image", promoImage); // Image is required for this form

    try {
      const path = "/v2/notification/promotional-notification"; // Fixed path for promotional
      const response = await fetch(`${apiPath}${path}`, {
        method: "POST",
        headers: {
          "x-auth-token": apiAuthToken,
          // Content-Type handled automatically for FormData
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && (data.success || data.message)) {
        alert("Promotional Notification posted successfully!");
        setPromoTitle("");
        setPromoDescription("");
        setPromoImage(null);
        // setPromoIsPromotion(true); // Reset to default
        // setPromoType("public"); // Reset to default
      } else {
        alert(data.message || "Failed to post promotional notification.");
      }
    } catch (error) {
      console.error("Error posting promotional notification:", error);
      alert("Something went wrong with promotional notification.");
    }
  };

  // --- Handle Submit for General Post (without Image) ---
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();

    // For simplicity, we'll send JSON for text-only posts if the backend expects it.
    // If your backend for "/v2/notification/post-with-out-image"
    // can handle FormData without files, you could use FormData here too.
    const postData = {
      title: generalTitle,
      description: generalDescription,
      isPromotion: generalIsPromotion,
      type: generalType,
    };

    try {
      const path = "/v2/notification/post-with-out-image"; // Fixed path for no-image posts
      const response = await fetch(`${apiPath}${path}`, {
        method: "POST",
        headers: {
          "x-auth-token": apiAuthToken,
          "Content-Type": "application/json", // Explicitly set Content-Type for JSON
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok && (data.success || data.message)) {
        alert("General Post notification sent successfully!");
        setGeneralTitle("");
        setGeneralDescription("");
        // setGeneralIsPromotion(false); // Reset to default
        // setGeneralType("public"); // Reset to default
      } else {
        alert(data.message || "Failed to send general post notification.");
      }
    } catch (error) {
      console.error("Error sending general post notification:", error);
      alert("Something went wrong with general post.");
    }
  };

  return (
    <Layout>
      <h1 className="text-center text-3xl font-bold py-10">
        Post Notifications
      </h1>

      <div className="mb-8">
        <Link
          to={"/notification/all"}
          className="px-5 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          View All Notifications
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* --- Form for Promotional Notification (with Image) --- */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Promotional Notification (with Image)
          </h2>
          <form
            onSubmit={handlePromotionalSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div>
              <label className="block font-medium">Title</label>
              <input
                type="text"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                required
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                value={promoDescription}
                onChange={(e) => setPromoDescription(e.target.value)}
                required
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium">Image (Required)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPromoImage(e.target.files[0])}
                required
                className="w-full border p-2 rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block font-medium">Type</label>
              <select
                value={promoType}
                onChange={(e) => setPromoType(e.target.value)}
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={promoIsPromotion}
                onChange={(e) => setPromoIsPromotion(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <label className="text-gray-700">Is Promotion?</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Post Promotional Notification
            </button>
          </form>
        </div>

        {/* --- Form for General Post (without Image) --- */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            General Post (No Image)
          </h2>
          <form onSubmit={handleGeneralSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Title</label>
              <input
                type="text"
                value={generalTitle}
                onChange={(e) => setGeneralTitle(e.target.value)}
                required
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                value={generalDescription}
                onChange={(e) => setGeneralDescription(e.target.value)}
                required
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium">Type</label>
              <select
                value={generalType}
                onChange={(e) => setGeneralType(e.target.value)}
                className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={generalIsPromotion}
                onChange={(e) => setGeneralIsPromotion(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <label className="text-gray-700">Is Promotion?</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Send General Post
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Notification;