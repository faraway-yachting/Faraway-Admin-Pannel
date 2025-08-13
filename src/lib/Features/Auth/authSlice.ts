import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface Credentials {
  email: string;
  password: string;
}

interface OtpData {
  otp: string;
  email: string;
}

interface ResendOtpData {
  email: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  email: string;
  newPassword: string;
}

const API_URL = `https://awais.thedevapp.online`;

export const signinUser = createAsyncThunk(
  "auth/signinUser",
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/admin/login`,
        credentials,
        {
          withCredentials: true,
        }
      );
      if (response?.data.error) {
        throw new Error(
          response?.data?.error?.message || "Something went wrong"
        );
      }
      const { token } = response.data.data;
      if (token) {
        localStorage.setItem("token", token);
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: ForgotPasswordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/admin/forgot-password`,
        data,{
          withCredentials: true,
        }
      );
      if (response?.data.error) {
        throw new Error(
          response?.data?.error?.message || "Something went wrong"
        );
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data: OtpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/admin/verify-otp`,
        data,{
          withCredentials: true,
        }
      );
      if (response?.data.error) {
        throw new Error(
          response?.data?.error?.message || "Something went wrong"
        );
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data: ResendOtpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/admin/resend-otp`,
        data,{
          withCredentials: true,
        }
      );
      if (response?.data.error) {
        throw new Error(
          response?.data?.error?.message || "Something went wrong"
        );
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/admin/reset-password`,
        data,{
          withCredentials: true,
        }
      );
       if (response?.data.error) {
        throw new Error(
          response?.data?.error?.message || "Something went wrong"
        );
      }
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Something went wrong";
      return rejectWithValue({ error: { message } });
    }
  }
);

// ---------------- STATE ----------------

interface AuthState {
  loading: boolean;
  user: string | null;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  loading: false,
  user: null,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signin
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Signin failed.";
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Forgot password failed";
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "OTP verification failed";
      })

      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Resend OTP failed";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as { error: { message: string } };
        state.error = payload?.error?.message || "Reset password failed";
      });
  },
});

export const { clearAuthState, logout } = authSlice.actions;
export default authSlice.reducer;