import React, { useState } from "react";
import Layout from "./layout";
import ChangePassword from "../components/settings/ChangePassword";
import { MdAdminPanelSettings } from "react-icons/md";
import AdminInformation from "../components/settings/AdminInformation";

const settingsSubMenu = [
  {
    title: "Admin Information",
    href: "personal-information",
    icon: "",
  },
  {
    title: "Security",
    href: "security",
    icon: "",
  },
];

function Settings() {
  const [subMenuItems, setSubMenuItems] = useState("personal-information");

  return (
    <Layout>
      <div className="w-full py-4">
        <h1 className="text-3xl text-center font-extrabold text-gray-400 my-8">
          Settings
        </h1>

        <div className="flex gap-4">
          <div className="w-[250px] bg-slate-200">
            <h1 className="text-center text-2xl text-gray-400 py-3">Options</h1>

            <ul>
              {settingsSubMenu.map((setting, i) => {
                return (
                  <li
                    className="text-md text-gray-600 px-4 py-2 cursor-pointer"
                    onClick={() => setSubMenuItems(setting.href)}
                    key={i}
                  >
                    {setting.title}{" "}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* submenu items */}
          <div className="w-full bg-slate-100">
            {subMenuItems == "security" ? <ChangePassword /> : null}
            {subMenuItems == "personal-information" ? (
              <AdminInformation />
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
