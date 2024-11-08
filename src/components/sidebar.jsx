import React from "react";
import { Link, useNavigate } from "react-router-dom";
import handleApiRequest from "../helpers/handleApiRequest";
import Cookies from "js-cookie";
const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "",
  },
  {
    title: "Order managenet",
    href: "/order-management",
    icon: "",
  },
  {
    title: "Rider management",
    href: "/rider-management",
    icon: "",
  },
  {
    title: "Restaurant management",
    href: "/restaurant-management",
    icon: "",
  },
  {
    title: "User management",
    href: "/user-management",
    icon: "",
  },
  {
    title: "Menu management",
    href: "/menu-management",
    icon: "",
  },
  {
    title: "Category management",
    href: "/category-management",
    icon: "",
  },
  {
    title: "Offer Management",
    href: "/offer-management",
    icon: "",
  },
];

export default function SiderBar() {
  const navigate = useNavigate();
  async function handleLogOut() {
    Cookies.remove("accessToken");
    navigate("/login");

    const result = await handleApiRequest("/admin/logout", {
      method: "GET",
    });
  }

  return (
    <div className="flex flex-col justify-between items-center max-h-screen bg-slate-100 px-4 py-12 h-screen">
      <ul>
        {navigation.map((item) => {
          return (
            <Link
              className="block py-3 px-3 w-full bg-blue-400 mt-5 text-sm rounded-md text-white text-center"
              key={item.title}
              to={item.href}
            >
              {item.title}
            </Link>
          );
        })}
      </ul>

      <button
        className="capitalize bg-slate-500 text-white px-4 py-3 rounded-md cursor-pointer"
        onClick={handleLogOut}
      >
        log out
      </button>
    </div>
  );
}
