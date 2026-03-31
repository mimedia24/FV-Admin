import React, { useState } from "react";
import Sidebar from "../components/sidebar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* The Sidebar handles its own width (w-72 or w-20). 
          On mobile, it's 'fixed', on desktop it's 'relative'.
      */}
      <Sidebar
        width={"w-72"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col min-w-0 h-screen relative transition-all duration-300
          /* Mobile: No margin because sidebar is a floating drawer */
          ml-0 
          /* Desktop: Margin matches the sidebar width */
          ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}`}
      >
        {/* MOBILE TOP BAR (Important: This gives users a way to open the sidebar) */}
        <div className="lg:hidden h-16 flex items-center px-4 bg-gray-950 border-b border-gray-800 shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
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
          <span className="ml-4 font-bold text-blue-500 uppercase tracking-wider text-sm">
            Foodverse Admin
          </span>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-content-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>

      {/* Internal CSS for the content area scrollbar to match the sidebar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-content-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-content-scrollbar::-webkit-scrollbar-track {
          background: #030712; 
        }
        .custom-content-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-content-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `,
        }}
      />
    </div>
  );
}
