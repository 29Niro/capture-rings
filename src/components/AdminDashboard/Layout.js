import React from "react";
import { Outlet } from "react-router-dom";
import { AdminFooter } from "./AdminFooter";
import { AdminHeader } from "./AdminHeader";
import Sidebar from "./Sidebar";

export const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader className="flex-shrink-0" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="flex-shrink-0 h-full overflow-auto" />
        <main className="flex-1 overflow-auto bg-gray-100">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <AdminFooter className="flex-shrink-0" />
    </div>
  );
};
