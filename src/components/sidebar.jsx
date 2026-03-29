import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  BellOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { GiFireZone } from "react-icons/gi";

// Modernized Navigation Data
const navigation = [
  { title: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { title: "Order Management", href: "/order-management", icon: <OrderIcon /> },
  { title: "Live Order Maps", href: "/order-map", icon: <MapsIcon /> },
  { title: "Rider Management", href: "/rider-management", icon: <RiderIcon /> },
  {
    title: "Restaurant Registry",
    href: "/restaurant-management",
    icon: <RestaurantIcon />,
  },
  { title: "User Database", href: "/user-management", icon: <UserIcon /> },
  { title: "Menu Catalog", href: "/menu-management", icon: <FoodIcon /> },
  { title: "Categories", href: "/category-management", icon: <CategoryIcon /> },
  {
    title: "Promotions & Offers",
    href: "/offer-management",
    icon: <OfferIcon />,
  },
  { title: "Service Charges", href: "/charges", icon: <ChargesIcon /> },
  { title: "Payouts", href: "/payment/rider", icon: <CreditCardOutlined /> },
  { title: "Broadcasts", href: "/notification", icon: <BellOutlined /> },
  { title: "Zone Control", href: "/zone-management", icon: <GiFireZone /> },
  { title: "System Settings", href: "/settings", icon: <SettingsIcon /> },
];

export default function Sidebar({
  width = "w-72",
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = () => {
    Cookies.remove("accessToken");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-xl bg-gray-900 text-white shadow-2xl border border-gray-700 active:scale-95 transition-all"
        >
          {isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-[50] flex flex-col bg-gray-950 text-gray-300 border-r border-gray-800 transition-all duration-300 ease-in-out
        ${isOpen ? `translate-x-0 ${width}` : "-translate-x-full lg:translate-x-0"} 
        ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        {/* Header / Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-900/50">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GiFireZone className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Foodverse<span className="text-blue-500"> Admin</span>
              </span>
            </div>
          )}
          {isCollapsed && (
            <GiFireZone className="text-blue-500 text-2xl mx-auto" />
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block text-gray-500 hover:text-white transition-colors"
          >
            {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Navigation - Scrollable Area */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 custom-scrollbar">
          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <li key={item.title}>
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative
                      ${
                        isActive
                          ? "bg-blue-600/10 text-blue-500 font-semibold"
                          : "hover:bg-gray-900 text-gray-400 hover:text-gray-100"
                      }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                    )}

                    <span
                      className={`text-xl transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-blue-500" : ""}`}
                    >
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.title}
                      </span>
                    )}

                    {/* Tooltip for Collapsed Mode */}
                    {isCollapsed && (
                      <div className="lg:group-hover:flex hidden absolute left-20 bg-gray-800 text-white text-xs py-2 px-3 rounded-md z-[100] whitespace-nowrap shadow-xl border border-gray-700">
                        {item.title}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-900 bg-gray-950/50 backdrop-blur-md">
          <button
            onClick={handleLogOut}
            className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200
              ${isCollapsed ? "justify-center" : ""}
              bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white group`}
          >
            <LogoutOutlined className="text-xl group-hover:rotate-12 transition-transform" />
            {!isCollapsed && (
              <span className="font-bold text-sm tracking-wide uppercase">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Custom Scrollbar CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `,
        }}
      />
    </>
  );
}

// Minimal Icons (Dashboard, etc remain same as your code but ensured consistency)
function DashboardIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );
}
function MapsIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
function RiderIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}
function RestaurantIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}
function FoodIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}
function CategoryIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
}
function OfferIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  );
}
function ChargesIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
