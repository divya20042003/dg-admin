// src/redux/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../api/authApi";

// LOGIN THUNK
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);

      // Check for business-level status (even if HTTP is 200)
      if (response.status === "SUCCESS") {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminData", JSON.stringify(response.data));
        return response.data;
      }

      // Handle FAILED status - return the error message from API
      return rejectWithValue(response.message || "Login failed");
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    isLoading: false,
    isAuthenticated: !!localStorage.getItem("adminToken"),
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;