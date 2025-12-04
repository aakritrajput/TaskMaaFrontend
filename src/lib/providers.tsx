"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./store";
import { useEffect } from "react";
import { login, logout } from "@/src/lib/features/auth/AuthSlice";
// import { setServerDown } from "@/src/lib/features/auth/AuthSlice";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import RootLoader from "@/app/loading";

function InitAuth({children}: {children: React.ReactNode}) {
  const dispatch = useDispatch();
  const path = usePathname();
  const router = useRouter();
  const authStatus = useSelector((state: RootState) => state.auth.authStatus)
  useEffect(() => {
    async function initAuthHandler(){
      try {
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/authCheck`, {withCredentials: true})
        const {_id, username, name='', email, profileType, profilePicture} = response.data.data
        dispatch(login({_id, username, name, email, profileType, profilePicture}))

        // uncomment it when server is again live:
        // dispatch(setServerDown()); // we will by ourself provide the reason whereever needed !!
        
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

  useEffect(()=>{
    if(authStatus == 'authenticated' && ['/', '/about', '/contact', '/auth/login', '/auth/signup'].includes(path)){
    router.push('/user/dashboard')
    }
    else if(authStatus == 'unauthenticated' && path.startsWith('/user/')){
      router.push('/auth/login')
    }
  }, [authStatus, path, router])

  // we will only show the exact children if all the sideEffects has run and all route pushes are happend and the unauthenticated users are on home page and authenticated ones on dashboard !!
  if (authStatus == 'loading' || (authStatus == 'authenticated' && ['/', '/about', '/contact', '/auth/login', '/auth/signup'].includes(path)) || (authStatus == 'unauthenticated' && path.startsWith('/user/') ) ){
    return <RootLoader/>
  } // if we are not doing this then for short time our home page is visible if we directly want to navigate authenticated user to dashboard !!
  else {
    return (
      <>
      {children}
      </>
    )
  }

}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitAuth>{children}</InitAuth>
    </Provider>
  );
}
