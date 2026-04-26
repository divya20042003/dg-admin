// src/api/productApi.js

import apiClient from "./apiClient";
import API from "../config/apiConfig";

// Get all products
export const getProducts = async () => {
  const response = await apiClient.get(API.PRODUCTS.LIST);
  return response.data;
};

// Add new product
export const addProduct = async (data) => {
  const response = await apiClient.post(API.PRODUCTS.ADD, data);
  return response.data;
};

// Get single product
export const getProduct = async (id) => {
  const response = await apiClient.get(API.PRODUCTS.GET(id));
  return response.data;
};

// Update product
export const updateProduct = async (id, data) => {
  const response = await apiClient.put(API.PRODUCTS.UPDATE(id), data);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await apiClient.delete(API.PRODUCTS.DELETE(id));
  return response.data;
};