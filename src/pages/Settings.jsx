import React, { useState } from "react";
import Layout from "./layout";
import ChangePassword from "../components/settings/ChangePassword";
import AdminInformation from "../components/settings/AdminInformation";
import { 
  HiOutlineUserCircle, 
  HiOutlineShieldCheck, 
  HiOutlineChevronRight 
} from "react-icons/hi"; // Modern Heroicons ব্যবহার করা হয়েছে

const settingsSubMenu = [
  {
    id: "personal-information",
    title: "Admin Profile",
    description: "Manage your personal details and public info.",
    icon: <HiOutlineUserCircle />,
    component: <AdminInformation />,
    color: "bg-blue-500",
  },
  {
    id: "security",
    title: "Login & Security",
    description: "Update password and secure your account.",
    icon: <HiOutlineShieldCheck />,
    component: <ChangePassword />,
    color: "bg-purple-500",
  },
];

function Settings() {
  const [selectedItem, setSelectedItem] = useState("personal-information");

  const renderContent = () => {
    const item = settingsSubMenu.find((item) => item.id === selectedItem);
    return item ? item.component : null;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#f8fafc] pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <header className="py-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Settings
            </h1>
            <p className="text-slate-500 mt-1">
              Configure your account preferences and security settings.
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="lg:w-1/3 w-full">
              <nav className="space-y-2">
                {settingsSubMenu.map((setting) => (
                  <button
                    key={setting.id}
                    onClick={() => setSelectedItem(setting.id)}
                    className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                      selectedItem === setting.id
                        ? "bg-white shadow-md ring-1 ring-slate-200"
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    {/* Icon with Dynamic Background */}
                    <div className={`p-3 rounded-xl text-white shadow-sm transition-transform duration-300 ${
                      selectedItem === setting.id ? setting.color : "bg-slate-300 group-hover:bg-slate-400"
                    }`}>
                      <span className="text-2xl">{setting.icon}</span>
                    </div>

                    <div className="text-left flex-1">
                      <h3 className={`font-semibold text-base ${
                        selectedItem === setting.id ? "text-slate-900" : "text-slate-700"
                      }`}>
                        {setting.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {setting.description}
                      </p>
                    </div>

                    {selectedItem === setting.id && (
                      <HiOutlineChevronRight className="self-center text-slate-400 animate-pulse" />
                    )}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[500px] transition-all duration-500 ease-in-out p-8">
                {/* Content Header (Conditional) */}
                <div className="mb-8 border-b border-slate-100 pb-5">
                  <h2 className="text-xl font-bold text-slate-800">
                    {settingsSubMenu.find(i => i.id === selectedItem)?.title}
                  </h2>
                </div>

                {/* Actual Component */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {renderContent()}
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