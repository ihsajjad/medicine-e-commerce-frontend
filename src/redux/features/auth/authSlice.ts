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

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => {
    const response = await apiClient.get("/api/users/current-user");
    return response.data;
  }
);

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
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<AuthState>) => {
          state.isLoading = false;
          state.user = action.payload.user;
        }
      );
  },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
