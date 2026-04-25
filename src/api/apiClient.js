// src/api/apiClient.js

import axios from "axios";
import API from "../config/apiConfig";
  console.log("API.BASE_URL:", API.BASE_URL);
const apiClient = axios.create({

    
  baseURL: API.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default apiClient;