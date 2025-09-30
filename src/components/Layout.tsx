// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet /> {/* This renders child route content */}
        </div>
        {/* Footer always at bottom */}
        <Footer/>
      </div>
      
    </div>
  );
}
