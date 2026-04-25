// src/api/authApi.js

import apiClient from "./apiClient";
import API from "../config/apiConfig";

export const loginApi = async (data) => {
  const response = await apiClient.post(API.ADMIN.LOGIN, data);
  return response.data;
};

export const logoutApi = async () => {
  const response = await apiClient.post(API.ADMIN.LOGOUT);
  return response.data;
};