import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = { _id: string; name?: string; email: string; username: string; profileType: string; profilePicture: string; };

interface AuthState {
  user: User | null;
  authStatus:"loading" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  user: null,
  authStatus: 'loading',
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.authStatus = 'authenticated';
    },
    logout: (state) => {
      state.user = null;
      state.authStatus = 'unauthenticated';
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
