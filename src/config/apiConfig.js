// src/config/apiConfig.js

const API = {
  BASE_URL: import.meta.env.VITE_API_URL,

  ADMIN: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
  },

  PRODUCTS: {
    LIST: "/products",
    ADD: "/products",
    GET: (id) => `/products/${id}`,
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },
};

export default API;