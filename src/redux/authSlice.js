// src/redux/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../api/authApi";

// LOGIN THUNK
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);

      if (response.status === "SUCCESS") {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminData", JSON.stringify(response.data));
        return response.data;
      }

      return rejectWithValue(response.message || "Login failed");
    } catch (error) {
      return rejectWithValue(error.message);
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

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;