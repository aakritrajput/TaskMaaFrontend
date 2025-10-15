'use client'

import { RootState } from "@/src/lib/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import RootLoader from "../loading";
import { useEffect } from "react";

export default function UserLayout({children}: {children: React.ReactNode;}) {
    const router = useRouter();
    const auth = useSelector((state: RootState) => state.auth)
    useEffect(() => {
        if (!auth.user) {
          router.push("/auth/login");
        }
    }, [auth, router]);
    
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