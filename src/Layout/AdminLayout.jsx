import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;