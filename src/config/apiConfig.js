// src/config/apiConfig.js

const API = {
  BASE_URL: import.meta.env.VITE_API_URL,

  ADMIN: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
  },
};

export default API;