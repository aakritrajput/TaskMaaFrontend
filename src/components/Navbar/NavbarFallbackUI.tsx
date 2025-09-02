// components/FallbackNavbar.tsx
"use client";
import React from "react";

export const FallbackNavbar = () => {
  return (
    <div className="mx-auto backdrop-blur-[5px] backdrop-filter px-3 py-2 flex justify-between items-center bg-[rgba(254,254,254,0.1)] h-16 w-[95vw] rounded-[20px] ">

      {/* Navbar content placeholder */}
      <div className="relative flex w-full items-center justify-between px-6 h-full">
        <div className="w-10 h-10 bg-white/30 rounded-full animate-pulse" /> {/* Logo placeholder */}
        <div className="sm:flex hidden space-x-4">
          <div className="w-16 h-4 bg-white/20 rounded-md animate-pulse" /> 
          <div className="w-16 h-4 bg-white/20 rounded-md animate-pulse" /> 
          <div className="w-16 h-4 bg-white/20 rounded-md animate-pulse" />
        </div>
        <div className="flex sm:hidden gap-2">
          <div className="w-12 h-4 bg-white/20 rounded-md animate-pulse" /> 
          <div className="w-12 h-4 bg-white/20 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
};
