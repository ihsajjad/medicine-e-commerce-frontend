import apiClient from "@/components/apiClient";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { email: string; role: string; emailVerified: boolean } | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isError: false,
  errorMessage: null,
};

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/users/sign-up", formData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 2xx
        return rejectWithValue(
          error.response.data.message || "An error occurred"
        );
      } else if (error.request) {
        // Request was made but no response received
        return rejectWithValue("No response from server");
      } else {
        // Something else happened
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    formData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/api/users/sign-in", formData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 2xx
        return rejectWithValue(
          error.response.data.message || "An error occurred"
        );
      } else if (error.request) {
        // Request was made but no response received
        return rejectWithValue("No response from server");
      } else {
        // Something else happened
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => {
    const response = await apiClient.get("/api/users/current-user");
    return response.data;
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await apiClient.post("/api/users/sign-out"); // Make sure this route exists
  return;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearUser(state) {
      state.user = null;
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // =================== Sign up =====================
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.user = null;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      // =================== Sign In =====================
      .addCase(signIn.pending, (state, action) => {
        state.isLoading = true;
        state.user = null;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<AuthState>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      // =================== Current user =====================
      .addCase(fetchCurrentUser.pending, (state, action) => {
        state.isLoading = true;
        state.user = null;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<AuthState>) => {
          state.isLoading = false;
          state.user = action.payload.user;
        }
      )
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(signOut.fulfilled, (state) => {
        (state.user = null),
          (state.isLoading = false),
          (state.isError = false),
          (state.errorMessage = null);
      });
  },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
