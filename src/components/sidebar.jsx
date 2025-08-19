import React, { useState } from "react";
import { Link } from "react-router-dom";

// Mock hooks and components for self-containment
const useNavigate = () => {
  const [path, setPath] = useState("/");
  return (newPath) => {
    console.log(`Navigating to: ${newPath}`);
    setPath(newPath);
  };
};

const useLocation = () => {
  return { pathname: window.location.pathname };
};

const handleApiRequest = async (url, options) => {
  console.log(`Mock API call to: ${url}`);
  return { success: true };
};

const Cookies = {
  remove: (name) => {
    console.log(`Removing cookie: ${name}`);
  },
};

// Icon imports (using inline SVGs for self-containment)
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M3 5.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 5.25v13.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18.75V5.25zm4.5 5.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5a1.125 1.125 0 01-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" clipRule="evenodd" />
  </svg>
);
const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M7.8 19.325a.75.75 0 01.405.086l.966.387a2.25 2.25 0 001.385 0l.966-.387a.75.75 0 01.405-.086H21a.75.75 0 01.75.75v5.5a.75.75 0 01-.75.75H21V21h.75a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V19.5a.75.75 0 01.75-.75h.398zm3.921-1.077l-1.932-.773a.75.75 0 00-.466 0l-1.932.773a.75.75 0 01-.466 0L4.256 17a.75.75 0 00-.466 0l-1.932.773a.75.75 0 01-.466 0L.3 18.75a.75.75 0 00-.3.466l.773 1.932a.75.75 0 010 .466l-.773 1.932a.75.75 0 000 .466l1.932.773a.75.75 0 01.466 0l1.932-.773a.75.75 0 00.466 0l1.932.773a.75.75 0 01.466 0l1.932-.773a.75.75 0 00.466 0l1.932.773a.75.75 0 01.466 0l1.932-.773a.75.75 0 00.466 0l.773 1.932a.75.75 0 010 .466l-1.932.773a.75.75 0 00-.466 0l-1.932-.773a.75.75 0 01-.466 0l-1.932.773a.75.75 0 00-.466 0l-1.932-.773a.75.75 0 01-.466 0zM12 21a2.25 2.25 0 100-4.5a2.25 2.25 0 000 4.5z" clipRule="evenodd" />
  </svg>
);
const RiderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4 0c1.66 0 2.99-1.34 2.99-3S13.66 5 12 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm8 8c1.66 0 2.99-1.34 2.99-3S17.66 13 16 13c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4 0c1.66 0 2.99-1.34 2.99-3S13.66 13 12 13c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-4 0c1.66 0 2.99-1.34 2.99-3S9.66 13 8 13C6.34 13 5 14.34 5 16s1.34 3 3 3z" />
  </svg>
);
const RestaurantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 21c0-2.76-2.24-5-5-5h-3v-2h3c2.76 0 5-2.24 5-5V2h-8v4c0 1.1-.9 2-2 2H6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h4v-2h-3c-2.76 0-5 2.24-5 5v1h24v-1z" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a5 5 0 100 10a5 5 0 000-10zM12 14c-4.42 0-8 3.58-8 8v2h16v-2c0-4.42-3.58-8-8-8z" />
  </svg>
);
const FoodIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 15v-5.25c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75V17c0 .41-.34.75-.75.75h-1.5c-.41 0-.75-.34-.75-.75zm0-8.5v-2.25c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v2.25c0 .41-.34.75-.75.75h-1.5c-.41 0-.75-.34-.75-.75z" />
  </svg>
);
const CategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20h4V4h-4v16zm-6 0h4V4H4v16zm12-16v16h4V4h-4z" />
  </svg>
);
const OfferIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 10.5c0-.83-.67-1.5-1.5-1.5h-2c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5h2c.83 0 1.5-.67 1.5-1.5V10.5zM12 2v20h2v-8h6V8h-6V2h-2z" />
  </svg>
);
const ChargesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 11h-2v2h2c.55 0 1-.45 1-1s-.45-1-1-1z" />
  </svg>
);
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.4 12c.07-.66.1-1.33.1-2s-.03-1.34-.1-2h2.21c.45-.61.79-1.29 1-2H18.9c-.31-.83-.75-1.59-1.25-2.27l1.7-1.7c-.4-.4-.8-1-1.2-1.4l-1.7 1.7c-.68-.5-1.44-.94-2.27-1.25V1.79c-.61-.45-1.29-.79-2-1H12.6c-.66.07-1.33.1-2 .1s-1.34-.03-2-.1H6.18c-.45.61-.79 1.29-1 2H3.1l-1.7 1.7c.4.4.8 1 1.2 1.4l1.7-1.7c.68.5 1.44.94 2.27 1.25V6.1c-.61.45-1.29.79-2 1H4.6c-.66.07-1.33.1-2 .1s-1.34-.03-2-.1H1.79c-.45-.61-.79-1.29-1-2H2.9c.31-.83.75-1.59 1.25-2.27l-1.7-1.7c.4-.4.8-1 1.2-1.4l1.7 1.7c.68-.5 1.44-.94 2.27-1.25V1.79c.61-.45 1.29-.79 2-1H12.6c.66.07 1.33.1 2 .1s1.34-.03 2-.1H21.21c.45.61.79 1.29 1 2h2.21c-.45.61-.79 1.29-1 2zM12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
  </svg>
);


const navigation = [
  { title: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { title: "Order management", href: "/order-management", icon: <OrderIcon /> },
  { title: "Rider management", href: "/rider-management", icon: <RiderIcon /> },
  { title: "Restaurant management", href: "/restaurant-management", icon: <RestaurantIcon /> },
  { title: "User management", href: "/user-management", icon: <UserIcon /> },
  { title: "Menu management", href: "/menu-management", icon: <FoodIcon /> },
  { title: "Category management", href: "/category-management", icon: <CategoryIcon /> },
  { title: "Offer Management", href: "/offer-management", icon: <OfferIcon /> },
  { title: "Schedule Charges", href: "/charges", icon: <ChargesIcon /> },
  { title: "Payment", href: "/payment/rider", icon: <ChargesIcon /> },
  { title: "Notification", href: "/notification", icon: <ChargesIcon /> },
  { title: "Settings", href: "/settings", icon: <SettingsIcon /> },
];

export default function SiderBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = async () => {
    Cookies.remove("accessToken");
    navigate("/login");
    const result = await handleApiRequest("/admin/logout", {
      method: "GET",
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar background overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* The main sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:transform-none md:flex md:flex-col md:justify-between md:items-center bg-gray-900 text-white md:min-h-screen p-4 md:p-6 z-50`}
      >
        <nav className="w-full">
          <ul className="space-y-4">
            {navigation.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.href}
                  onClick={toggleSidebar} // Close sidebar on link click
                  className={`flex items-center gap-4 py-3 px-4 rounded-xl font-medium transition-colors duration-200 group ${
                    location.pathname.startsWith(item.href)
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="flex-shrink-0 text-lg group-hover:text-white transition-colors duration-200">
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 w-full">
          <button
            onClick={handleLogOut}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 13a1 1 0 01-1 1H9a1 1 0 01-1-1v-2a1 1 0 011-1h6a1 1 0 011 1v2z" />
              <path d="M12 2a10 10 0 100 20a10 10 0 000-20zM12 19a7 7 0 110-14a7 7 0 010 14z" />
              <path d="M14.5 11h-2a1 1 0 010-2h2a1 1 0 010 2z" />
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
