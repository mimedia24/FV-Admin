import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import handleApiRequest from "../helpers/handleApiRequest";
import Cookies from "js-cookie";

import { FaHome } from "react-icons/fa";
import { FaBorderNone } from "react-icons/fa6";
import { GiStorkDelivery } from "react-icons/gi";
import { IoRestaurant } from "react-icons/io5";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <FaHome />,
    default: true,
  },
  {
    title: "Order managenet",
    href: "/order-management",
    icon: <FaBorderNone />,
  },
  {
    title: "Rider management",
    href: "/rider-management",
    icon: <GiStorkDelivery />,
  },
  {
    title: "Restaurant management",
    href: "/restaurant-management",
    icon: <IoRestaurant />,
  },
  {
    title: "User management",
    href: "/user-management",
    icon: <FaUserFriends />,
  },
  {
    title: "Menu management",
    href: "/menu-management",
    icon: <IoFastFoodSharp />,
  },
  {
    title: "Category management",
    href: "/category-management",
    icon: <BiCategory />,
  },
  {
    title: "Offer Management",
    href: "/offer-management",
    icon: <FaMoneyBillAlt />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <IoMdSettings />,
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

  // get location
  let location = useLocation();

  return (
    <div className="flex flex-col justify-between items-center max-h-screen bg-slate-100 px-4 py-12 h-screen">
      <ul>
        {navigation.map((item) => {
          return (
            <Link
              className={
                location.pathname.startsWith(item.href)
                  ? "flex items-center gap-3 py-3 px-3 w-full bg-[#0660fe] mt-5 text-sm rounded-md font-bold text-white text-center"
                  : "flex items-center gap-3 py-3 px-3 w-full bg-slate-300 mt-5 text-sm rounded-md font-bold text-gray-600 text-center"
              }
              key={item.title}
              to={item.href}
            >
              {item.icon}
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
