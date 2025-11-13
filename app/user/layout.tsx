'use client'

import { RootState } from "@/src/lib/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import RootLoader from "../loading";
import { useEffect } from "react";

export default function UserLayout({children}: {children: React.ReactNode;}) {
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth)
    const authStatus = useSelector((state: RootState) => state.auth.authStatus)

    useEffect(() => {
      if(authStatus === "ServerDown"){
        // whenever we get any error or limit reached cases we will update the following message...
        alert("TaskMaa's redis upstash caching requests limit has been reached for this month. Therefore please visit maa's personal dashboard when the limit resets. Very sorry for the inconvenience caused !")
        router.push('/')
        return ;
      }
      if (!auth.user) {
        router.push("/auth/login");
      }
    }, [auth, router, authStatus]);
    
    // Optionally, we will show a loader while redirecting
    if (!auth.user) {
      return <RootLoader/>;
    }

    return (
        <>
        {children}
        </>
    )
}