import React, { useState } from "react";
import Layout from "./layout";
import ChangePassword from "../components/settings/ChangePassword";
import AdminInformation from "../components/settings/AdminInformation";
import { MdAdminPanelSettings, MdLock } from "react-icons/md";

// Define settings sub-menu items with icons
const settingsSubMenu = [
  {
    title: "Admin Information",
    href: "personal-information",
    icon: <MdAdminPanelSettings className="text-xl" />,
    component: <AdminInformation />,
  },
  {
    title: "Security",
    href: "security",
    icon: <MdLock className="text-xl" />,
    component: <ChangePassword />,
  },
];

function Settings() {
  const [selectedItem, setSelectedItem] = useState("personal-information");

  // Find the selected component based on the current state
  const renderContent = () => {
    const item = settingsSubMenu.find((item) => item.href === selectedItem);
    return item ? item.component : null;
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-gray-50 text-gray-800">
        <div className="container mx-auto p-4">
          <h1 className="text-4xl text-center font-bold text-gray-700 py-8">
            Settings
          </h1>

          <div className="flex flex-col md:flex-row gap-6 bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Left sidebar for navigation */}
            <div className="md:w-1/4 p-4 border-r border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                Options
              </h2>
              <ul>
                {settingsSubMenu.map((setting) => (
                  <li
                    key={setting.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedItem === setting.href
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedItem(setting.href)}
                  >
                    {setting.icon}
                    <span className="text-lg">{setting.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main content area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
