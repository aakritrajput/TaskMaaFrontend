import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = { id: string; name: string };

interface AuthState {
  user: User | null;
  token: string | null;
  authStatus:"loading" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  user: null,
  token: null,
  authStatus: 'loading',
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.authStatus = 'authenticated';
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.authStatus = 'unauthenticated';
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
