import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../services/authApi";

const userFromStorage = JSON.parse(localStorage.getItem("user"));

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginApi(payload);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.content || "Đăng nhập thất bại");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await registerApi(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.content || "Đăng ký thất bại");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 