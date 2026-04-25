import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { adminLogin } from "../redux/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email.trim()) {
      setLocalError("Email is required");
      return;
    }

    if (!password.trim()) {
      setLocalError("Password is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email");
      return;
    }

    // Dispatch login action
    dispatch(adminLogin({ email, password }));
  };

  useEffect(() => {
    if (isError && errorMessage) {
      setLocalError(errorMessage);
    }
  }, [isError, errorMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[380px] p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />

          {(localError || isError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {localError || errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-500 py-3 rounded-lg font-semibold hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Demo: admin@gmail.com / admin@123
        </p>
      </div>
    </div>
  );
}

export default Login;