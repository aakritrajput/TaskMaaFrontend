"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ListChecks, Users, MessageSquare, HeartHandshake } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Tasks", href: "/tasks", icon: ListChecks },
  { name: "Shared Goals", href: "/shared-goals", icon: Users },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Maa", href: "/maa", icon: HeartHandshake },
];

export default function SideOrDownBar() {
  const pathname = usePathname();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  return (
    <div
      className={`
        ${isAuthenticated ? 'flex md:flex-col' : 'hidden'}
        fixed z-50  md:top-1/2 md:-translate-y-1/2 md:left-2 md:h-[60vh] md:w-20
        bottom-0 left-0 w-full h-16
        bg-gradient-to-br from-teal-900/50 to-emerald-800/40
        backdrop-blur-xl shadow-lg md:rounded-xl
        border-t md:border-r border-white/10
      `}
    >
      <nav
        className="
          flex justify-around items-center w-full h-full
          md:flex-col md:py-6 md:gap-8
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="
                flex flex-col items-center justify-center gap-1 
                text-white/80 hover:text-white transition
              "
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "text-green-400" : "text-white/70"
                }`}
              />
              <span
                className={`
                  text-[10px] text-center leading-tight
                  ${isActive ? "text-green-400 font-medium" : "text-white/70"}
                `}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
