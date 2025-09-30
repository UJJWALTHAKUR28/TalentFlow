// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";


export default function Layout() {
  return (
    <>
    <div className="flex h-screen">

      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet /> 
        </div>
      </div>
      
    </div>
    </>
  );
}
