"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  MessageCircle,
  Bot,
  User,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Props = { children: React.ReactNode };

const NAV = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Shared Goals", href: "/shared-goals", icon: Users },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "AI Assistant", href: "/assistant", icon: Bot },
  { name: "Profile", href: "/profile", icon: User },
];

export default function SidebarLayout({ children }: Props) {
  // mobileOpen -> overlay on small screens
  const [mobileOpen, setMobileOpen] = useState(false);
  // collapsed -> desktop collapsed state (slides left leaving icons visible)
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();

  // Close mobile overlay automatically when resizing to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ESC closes mobile overlay
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // class helpers
  const mobileTranslate = mobileOpen ? "translate-x-0" : "-translate-x-full";
  const mdTranslate = collapsed ? "md:-translate-x-[11rem]" : "md:translate-x-0";

  return (
    <div className="min-h-screen">
      {/* Mobile menu button (top-left) */}
      <button
        aria-label="Open sidebar"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-white/6 backdrop-blur border border-white/6"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Sidebar (fixed) - slides for mobile and slides-left for desktop collapse */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 w-64 transform ${mobileTranslate} ${mdTranslate} transition-transform duration-300 ease-in-out bg-white/6 backdrop-blur-md border-r border-white/10 shadow-lg overflow-y-auto`}
        aria-hidden={!mobileOpen && typeof window !== "undefined" && window.innerWidth < 768}
      >
        {/* Header */}
        <div className={`flex items-center ${collapsed && !mobileOpen ? "justify-end pr-4" : "justify-between px-4"} py-4`}> 
          <div className={`flex items-center gap-3 ${collapsed && !mobileOpen ? "pr-1" : ""}`}>
            {/* logo box */}
            <div className="h-9 w-9 rounded-md bg-white/8 flex items-center justify-center">
              {/* simple logo (you can replace with <Image />) */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" fillOpacity="0.12" />
                <path d="M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Always show label in mobile overlay, only hide in desktop collapse */}
            {(!collapsed || mobileOpen) && <span className="text-white font-semibold">TaskMaa</span>}
          </div>

          <div className="flex items-center gap-2">
            {/* Close on mobile */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-2 rounded hover:bg-white/6"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4 text-white" />
            </button>

            {/* Collapse toggle (desktop) */}
            <button
              onClick={() => setCollapsed((s) => !s)}
              className="hidden md:inline-flex p-2 rounded hover:bg-white/6"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4 text-white" /> : <ChevronLeft className="h-4 w-4 text-white" />}
            </button>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="mt-4 px-1 pb-8">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center w-full my-1 py-3 rounded-lg transition-colors duration-200 
                  ${(collapsed && !mobileOpen) ? "justify-end pr-4" : "pl-4"}
                  ${active ? "bg-[#39ebd694] text-white" : "text-gray-200 hover:bg-[#39ebd6c5]"}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-white" : "text-gray-200 group-hover:text-white"}`} />
                {/* Always show label in mobile overlay, only hide in desktop collapse */}
                {(!collapsed || mobileOpen) && <span className="ml-3 text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* optional footer area */}
        <div className={`mt-auto mb-6 px-4 ${(collapsed && !mobileOpen) ? "hidden" : ""}`}>
          {/* You can add version text, small actions, etc. */}
        </div>
      </aside>

      {/* Mobile overlay (only when mobileOpen) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Main content: on md+ we give left padding to make space for sidebar (64 when open, 20 when collapsed). On small screens no padding so overlay doesn't push content. */}
      <main className={`transition-all duration-300 ${(collapsed && !mobileOpen) ? "md:pl-20" : "md:pl-64"}`}>
        {children}
      </main>
    </div>
  );
}