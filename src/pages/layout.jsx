import React, { useState } from "react";
import Sidebar from "../components/sidebar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <Sidebar
        width={"w-72"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main
        className={`min-h-screen transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        <div className="lg:hidden h-16 flex items-center px-4 bg-white border-b border-slate-200 sticky top-0 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <span className="ml-4 font-bold text-blue-600 uppercase tracking-wider text-sm">
            Foodverse Admin
          </span>
        </div>

        <div className="overflow-y-auto overflow-x-hidden p-3 md:p-6 custom-content-scrollbar">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-content-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-content-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-content-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-content-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `,
        }}
      />
    </div>
  );
}