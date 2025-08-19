import axios from "axios";
import React, { useState } from "react";
import { apiAuthToken, apiPath } from "../../../secrets";

function RegisterNewRider() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
  });

  const [files, setFiles] = useState({
    profileImage: null,
    nidFront: null,
    nidBack: null,
  });

  const [previews, setPreviews] = useState({
    profileImage: null,
    nidFront: null,
    nidBack: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    setFiles({ ...files, [name]: file });
    if (file) {
      setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
    } else {
      setPreviews({ ...previews, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!files.profileImage || !files.nidFront || !files.nidBack) {
      setMessage("Please upload all required images.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      Object.entries(files).forEach(([key, file]) => data.append(key, file));

      const response = await axios.post(`${apiPath}/v2/rider/register`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": apiAuthToken,
        },
      });

      if (response.data.success) {
        setMessage("Rider registered successfully!");
        setFormData({
          name: "",
          phoneNumber: "",
          email: "",
          password: "",
          address: "",
        });
        setFiles({ profileImage: null, nidFront: null, nidBack: null });
        setPreviews({ profileImage: null, nidFront: null, nidBack: null });
      } else {
        setMessage("Registration failed.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering rider");
    }

    setLoading(false);
  };

  const fileFields = [
    { name: "profileImage", label: "Profile Image" },
    { name: "nidFront", label: "NID Front" },
    { name: "nidBack", label: "NID Back" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-2xl">
      <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-800">
        New Rider
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Fill out the form below to register a new rider.
      </p>
      {message && (
        <div
          className={`p-4 rounded-xl mb-6 text-center font-semibold transition-colors duration-300 ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <div className="col-span-1 md:col-span-2">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fileFields.map((field) => (
            <div key={field.name} className="flex flex-col items-center">
              <label className="text-center font-medium mb-3 text-gray-700">
                {field.label}
              </label>
              <label
                htmlFor={field.name}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer flex flex-col justify-center items-center p-4 text-center text-gray-500 transition-colors hover:bg-gray-50 hover:border-blue-500 relative overflow-hidden"
              >
                <input
                  id={field.name}
                  type="file"
                  name={field.name}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
                {previews[field.name] ? (
                  <img
                    src={previews[field.name]}
                    alt={`${field.label} Preview`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-10 h-10 text-gray-400 mb-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <span className="text-sm">Click to upload</span>
                    <span className="text-xs text-gray-400 mt-1">
                      (PNG, JPG, etc.)
                    </span>
                  </>
                )}
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Register Rider"}
        </button>
      </form>
    </div>
  );
}

export default RegisterNewRider;
