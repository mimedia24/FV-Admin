import React, { useState } from "react";
import Layout from "./layout";
import { apiAuthToken, apiPath } from "../../secrets";
import { Link } from "react-router-dom";

function Notification() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isPromotion, setIsPromotion] = useState(true);
  const [type, setType] = useState("public");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isPromotion", isPromotion);
    formData.append("type", type);
    if (image) {
      formData.append("image", image);
    }

    try {
      console.log("response data : ");
      const response = await fetch(
        `${apiPath}/v2/notification/promotional-notification`,
        {
          method: "POST",
          body: formData,
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      const data = await response.json();

      console.log("response data : ", data);

      if (data.success) {
        alert("Notification posted successfully!");
        setTitle("");
        setDescription("");
        setImage(null);
      } else {
        alert(data.message || "Failed to post notification.");
      }
    } catch (error) {
      console.error("Error posting notification:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <Layout>
      <h1 className="text-center text-3xl font-bold py-10">
        Post Notification
      </h1>

      <div>
        <Link
          to={"/notification/all"}
          className="px-5 py-4 bg-blue-600 text-white rounded-md"
        >
          View All notification
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPromotion}
            onChange={(e) => setIsPromotion(e.target.checked)}
          />
          <label>Is Promotion?</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Post Notification
        </button>
      </form>
    </Layout>
  );
}

export default Notification;
