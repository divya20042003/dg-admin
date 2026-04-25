import { useNavigate } from "react-router-dom";
import API from "../config/apiConfig.js";
import apiClient from "../api/apiClient";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";
function Navbar() {
  const navigate = useNavigate();

const dispatch = useDispatch();

const handleLogout = async () => {
  try {
    const res = await apiClient.post(API.ADMIN.LOGOUT);

    if (res.data?.status === "SUCCESS") {
      // 1. Redux state clear
      dispatch(logout());

      // 2. storage cleanup (already in reducer also ok)
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      sessionStorage.clear();

      // 3. redirect
      navigate("/login", { replace: true });
    } else {
      console.log("Logout failed:", res.data);
    }
  } catch (error) {
    console.log("Logout API failed:", error);
  }
};
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center">
      <h1 className="text-3xl font-semibold text-purple-900">
        Welcome Admin
      </h1>

      <button
        onClick={handleLogout}
        className="bg-yellow-500 px-5 py-2 rounded-lg font-semibold hover:opacity-90"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;