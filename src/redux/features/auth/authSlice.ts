import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: { email: string; role: string; emailVerified: boolean } | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const {} = authSlice.actions;
export default authSlice.reducer;
