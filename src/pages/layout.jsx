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
      <main
        className={`flex-1 flex flex-col min-w-0 h-screen relative ${isCollapsed ? "ml-20" : "ml-72"}`}
      >
        {/* Optional: Top Header for Page Title/Profile could go here */}

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 custom-content-scrollbar">
          {/* Content Wrapper: 
              Adds a subtle fade-in animation and max-width for better readability 
          */}
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
