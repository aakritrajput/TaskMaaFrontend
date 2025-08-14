"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { login } from "@/src/lib/features/auth/AuthSlice";
import type { User } from "@/src/lib/features/auth/AuthSlice";

function InitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const response: { status: number; data: { user: User; token: string } } = {
      status: 200,
      data: { user: { id: "12345", name: "Aakrit" }, token: "12324324" },
    };
    if (response.status !== 200) {
      console.log("Not logged in !!");
      return;
    }
    dispatch(login(response.data));
    console.log('Successfully set login in store')
  }, [dispatch]);
  return null; // This component just runs side effects
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitAuth />
      {children}
    </Provider>
  );
}
