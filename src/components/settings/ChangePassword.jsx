import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { apiAuthToken, apiPath } from "../../../secrets";
import { HiOutlineLockClosed, HiOutlineKey, HiCheckCircle } from "react-icons/hi";
import { RiLoader4Line } from "react-icons/ri";

const defaultFormData = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

function ChangePassword() {
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    const id = localStorage.getItem("id");

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${apiPath}/admin/change-password?id=${id}`,
        {
          password: formData.password,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Password updated successfully");
        setFormData(defaultFormData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
          <HiOutlineLockClosed className="text-3xl" />
        </div>
        <p className="text-slate-500 text-sm">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Current Password
          </label>
          <div className="relative">
            <HiOutlineKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleOnChange}
              value={formData.password}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            New Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800"
              type="password"
              name="newPassword"
              placeholder="Minimum 6 characters"
              onChange={handleOnChange}
              value={formData.newPassword}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Confirm New Password
          </label>
          <div className="relative">
            <HiCheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-800"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              onChange={handleOnChange}
              value={formData.confirmPassword}
              required
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
          type="submit"
        >
          {loading ? (
            <RiLoader4Line className="animate-spin text-xl" />
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;