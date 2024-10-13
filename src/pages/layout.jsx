import React from "react";
import SiderBar from "../components/sidebar";

export default function Layout({ children }) {
  return (
    <div className="w-full min-h-screen flex">
      <SiderBar />
      <div className="w-full overflow-y-scroll overflow-x-hidden h-screen">{children}</div>
    </div>
  );
}
