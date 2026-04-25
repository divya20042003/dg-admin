// src/api/authApi.js

import apiClient from "./apiClient";
import API from "../config/apiConfig";

export const loginApi = async (credentials) => {
  const response = await apiClient.post(API.ADMIN.LOGIN, credentials);
  return response.data;
};