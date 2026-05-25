import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import {
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  LayoutDashboard,
  ClipboardList,
  MapPinned,
  Bike,
  Store,
  Users,
  UtensilsCrossed,
  Shapes,
  Tags,
  ReceiptText,
  WalletCards,
  BellRing,
  Flame,
  Settings,
  PanelLeftOpen,
  BadgeDollarSign,
  BarChart3,
} from "lucide-react";

const navigation = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Order Management", href: "/order-management", icon: ClipboardList },
  { title: "Live Order Maps", href: "/order-map", icon: MapPinned },
  { title: "Rider Management", href: "/rider-management", icon: Bike },
  { title: "Restaurant Registry", href: "/restaurant-management", icon: Store },
  { title: "User Database", href: "/user-management", icon: Users },
  { title: "Menu Catalog", href: "/menu-management", icon: UtensilsCrossed },
  { title: "Categories", href: "/category-management", icon: Shapes },
  { title: "Promotions & Offers", href: "/offer-management", icon: Tags },
  { title: "Service Charges", href: "/charges", icon: ReceiptText },
  { title: "Manual Discounts", href: "/manual-discounts", icon: BadgeDollarSign,},
  { title: "Payouts", href: "/payment/rider", icon: WalletCards },
  { title: "Broadcasts", href: "/notification", icon: BellRing },
  { title: "Profit Reports", href: "/reports", icon: BarChart3 },
  { title: "Zone Control", href: "/zone-management", icon: Flame },
  { title: "System Settings", href: "/settings", icon: Settings },
  
];

export default function Sidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const handleLogOut = () => {
    Cookies.remove("accessToken");
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex flex-col border-r border-white/5 bg-[#020817] text-slate-300 transition-all duration-300 ease-in-out
        ${
          isOpen
            ? "translate-x-0 w-80 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.7)]"
            : "-translate-x-full lg:translate-x-0"
        }
        ${isCollapsed ? "lg:w-24" : "lg:w-72"}`}
      >
        <div
          className={`relative flex h-20 items-center border-b border-white/5 bg-white/[0.02] flex-shrink-0 ${
            isCollapsed && !isOpen
              ? "justify-center px-3"
              : "justify-between px-5"
          }`}
        >
          {isCollapsed && !isOpen ? (
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              title="Open sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20">
                  <img
                    src="/foodverse.png"
                    alt="foodverse"
                    className="h-7 w-7 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300/80">
                    Food Verse
                  </p>
                  <h2 className="truncate text-[18px] font-black tracking-tight text-white">
                    Main Admin
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                  title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <MenuFoldOutlined className="text-[18px]" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
                >
                  <MenuFoldOutlined className="text-[20px]" />
                </button>
              </div>
            </>
          )}
        </div>

        <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-5">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.title}>
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group relative flex items-center rounded-2xl transition-all duration-200
                    ${isCollapsed && !isOpen ? "justify-center px-3 py-3.5" : "gap-4 px-4 py-3.5"}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200
                      ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-slate-500 group-hover:bg-white/[0.05] group-hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>

                    {(!isCollapsed || isOpen) && (
                      <div className="min-w-0">
                        <span
                          className={`block truncate text-sm font-semibold ${
                            isActive ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>
                    )}

                    {isCollapsed && !isOpen && (
                      <div className="absolute left-[76px] top-1/2 z-[100] hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-2xl lg:group-hover:block">
                        {item.title}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/5 bg-white/[0.02] p-3">
          <button
            onClick={handleLogOut}
            className={`group flex w-full items-center rounded-2xl transition-all duration-200
            ${isCollapsed && !isOpen ? "justify-center p-3.5" : "gap-4 px-4 py-3.5"}
            bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] group-hover:bg-white/10">
              <LogoutOutlined className="text-[18px]" />
            </span>

            {(!isCollapsed || isOpen) && (
              <div className="text-left">
                <span className="block text-sm font-bold tracking-wide">
                  Sign Out
                </span>
                <span className="block text-[11px] text-red-300/80 group-hover:text-white/80">
                  End admin session
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.25);
            border-radius: 999px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.45);
          }
        `,
        }}
      />
    </>
  );
}