import React, { useMemo, useState } from "react";
import Layout from "./layout";
import ChangePassword from "../components/settings/ChangePassword";
import AdminInformation from "../components/settings/AdminInformation";
import AppUpdateManagement from "../components/settings/AppUpdateManagement";
import {
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineChevronRight,
  HiOutlineSparkles,
  HiOutlineDeviceMobile,
} from "react-icons/hi";

const settingsSubMenu = [
  {
    id: "personal-information",
    title: "Admin Profile",
    description: "Manage your personal details and public profile.",
    icon: <HiOutlineUserCircle />,
    component: <AdminInformation />,
    activeClass:
      "from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20",
    softClass: "bg-blue-50 text-blue-600",
  },
  {
    id: "security",
    title: "Login & Security",
    description: "Update password and secure your account.",
    icon: <HiOutlineShieldCheck />,
    component: <ChangePassword />,
    activeClass:
      "from-fuchsia-600 to-violet-600 text-white shadow-lg shadow-fuchsia-500/20",
    softClass: "bg-violet-50 text-violet-600",
  },
  {
    id: "app-update",
    title: "App Update Control",
    description: "Manage optional reminders and mandatory app upgrades.",
    icon: <HiOutlineDeviceMobile />,
    component: <AppUpdateManagement />,
    activeClass:
      "from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/20",
    softClass: "bg-emerald-50 text-emerald-600",
  },
];

function Settings() {
  const [selectedItem, setSelectedItem] = useState("personal-information");

  const activeMenu = useMemo(
    () => settingsSubMenu.find((item) => item.id === selectedItem),
    [selectedItem]
  );

  const renderContent = () => {
    return activeMenu ? activeMenu.component : null;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="py-8 md:py-10">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
              <div className="relative p-6 md:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.10),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.10),_transparent_30%)]" />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
                      <HiOutlineSparkles className="text-sm" />
                      Account Control Center
                    </div>

                    <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                      Settings
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
                      Configure your account preferences, profile information and
                      security controls from one modern admin workspace.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:min-w-[320px]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                        Sections
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-slate-900">
                        {settingsSubMenu.length}
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                        Active View
                      </p>
                      <h3 className="mt-1 truncate text-base font-black text-slate-900">
                        {activeMenu?.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main layout */}
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Sidebar */}
            <aside>
              <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 px-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    Settings Menu
                  </p>
                  <h2 className="mt-1 text-lg font-black text-slate-900">
                      Admin Controls
                  </h2>
                </div>

                <nav className="space-y-3">
                  {settingsSubMenu.map((setting) => {
                    const isActive = selectedItem === setting.id;

                    return (
                      <button
                        key={setting.id}
                        onClick={() => setSelectedItem(setting.id)}
                        className={`group w-full rounded-3xl border p-4 text-left transition-all duration-300 ${
                          isActive
                            ? "border-transparent bg-gradient-to-r " +
                              setting.activeClass
                            : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-all duration-300 ${
                              isActive
                                ? "bg-white/15 text-white"
                                : setting.softClass
                            }`}
                          >
                            {setting.icon}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3
                              className={`text-base font-bold ${
                                isActive ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {setting.title}
                            </h3>
                            <p
                              className={`mt-1 text-xs ${
                                isActive ? "text-white/80" : "text-slate-400"
                              }`}
                            >
                              {setting.description}
                            </p>
                          </div>

                          <HiOutlineChevronRight
                            className={`mt-1 text-lg transition-transform duration-300 ${
                              isActive
                                ? "translate-x-0 text-white"
                                : "text-slate-300 group-hover:translate-x-1"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <main>
              <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5 md:px-8">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                        Current Section
                      </p>
                      <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                        {activeMenu?.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {activeMenu?.description}
                      </p>
                    </div>

                    <div
                      className={`inline-flex items-center rounded-2xl px-4 py-2 text-sm font-bold ${
                        activeMenu?.id === "personal-information"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-violet-50 text-violet-600"
                      }`}
                    >
                      {activeMenu?.title}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {renderContent()}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
