"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { login, logout } from "@/src/lib/features/auth/AuthSlice";
import type { User } from "@/src/lib/features/auth/AuthSlice";

function InitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const response: { status: number; data: { user: User; token: string } } = {
      status: 200,
      data: { user: { id: "12345", name: "Aakrit" }, token: "12324324" },
    };
    
    if (response.status !== 200) {  // will do deep check that if response includes logged in or out as the reponse will be 200 for successful req but for now we will be using this only
      console.log("Not logged in !!");
      dispatch(logout()) // if not logged in to toggle authstatus from loading to unauthenticated
      return;
    }
    dispatch(login(response.data)); // toggle authstatus from loading to authenticated
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
