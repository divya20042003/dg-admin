import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Sidebar() {
  return (
    <div className="w-[260px] min-h-screen bg-white border-r border-gray-200 p-6 shadow-sm">
      <div className="text-center mb-10">
        <img
          src={logo}
          alt="logo"
          className="w-[140px] h-auto object-contain mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold text-purple-900">
          Admin Panel
        </h2>
      </div>

      <nav className="flex flex-col gap-5 text-lg font-medium text-gray-700">
        <Link to="/">Dashboard</Link>
        <Link to="/products">Products</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </div>
  );
}

export default Sidebar;