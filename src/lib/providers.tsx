"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { login, logout } from "@/src/lib/features/auth/AuthSlice";
import axios from "axios";

function InitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function initAuthHandler(){
      try {
        const response = await axios.get('http://locahost:5000/api/user/authCheck', {withCredentials: true})
        dispatch(login(response.data.data))
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
          console.log(error.response.data.message);
        } else {
          console.log("An unexpected error occurred");
        }
        dispatch(logout())
      }
    }
    initAuthHandler() ;
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
