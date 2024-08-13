import apiClient from "@/components/apiClient";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { email: string; role: string; emailVerified: boolean } | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
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
