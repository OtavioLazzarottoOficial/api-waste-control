import { useState } from "react";
import { Outlet } from "react-router-dom";
import MainContent from "../core-components/main-content";
import Header from "../core-components/header";
import NavBar from "../core-components/navbar";

export default function LayoutMain() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-row h-screen overflow-hidden w-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 h-full shrink-0">
        <NavBar />
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity duration-300" 
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Drawer container */}
          <div className="relative flex flex-col w-72 h-full bg-amber-700 shadow-2xl transition-transform duration-300">
            <NavBar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
        <MainContent className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
}
