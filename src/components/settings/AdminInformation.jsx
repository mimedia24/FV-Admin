import React from "react";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineBadgeCheck,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineUserCircle,
} from "react-icons/hi";

function AdminInformation() {
  // Dummy data for Foodverse Delivery Admin
  const adminData = {
    name: "MD Ibrahmi",
    role: "Super Admin",
    email: "admin@komolnogor.com",
    phone: "+880 1861-113852",
    joinedDate: "March 15, 2024",
    location: "Lakshmipur, Bangladesh",
    status: "Active",
    managedZones: ["Lakshmipur", "Noakhali", "Bangladesh"],
    avatar: null, // Placeholder for image
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div className="h-32 w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-lg"></div>
        <div className="absolute -bottom-6 left-8 flex items-end gap-5">
          <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-xl">
            {adminData.avatar ? (
              <img
                src={adminData.avatar}
                alt="Profile"
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <HiOutlineUserCircle className="text-6xl" />
              </div>
            )}
          </div>
          <div className="pb-1">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              {adminData.name}
              <HiOutlineBadgeCheck className="text-blue-500 text-xl" />
            </h2>
            <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              {adminData.role}
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {/* Contact Information */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            Contact Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                <HiOutlineMail className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="text-sm font-semibold text-slate-700">
                  {adminData.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                <HiOutlinePhone className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone Number</p>
                <p className="text-sm font-semibold text-slate-700">
                  {adminData.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            Account Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                <HiOutlineCalendar className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Joined Date</p>
                <p className="text-sm font-semibold text-slate-700">
                  {adminData.joinedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
                <HiOutlineLocationMarker className="text-xl" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="text-sm font-semibold text-slate-700">
                  {adminData.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsibility Section */}
      <div className="mt-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          Managed Delivery Zones
        </h3>
        <div className="flex flex-wrap gap-2">
          {adminData.managedZones.map((zone, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 shadow-sm"
            >
              {zone}
            </span>
          ))}
          <button className="px-4 py-2 border border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
            + Assign New Zone
          </button>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-8 flex justify-end">
        <button className="px-8 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default AdminInformation;
