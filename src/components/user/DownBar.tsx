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
        fixed z-50 left-1/2 -translate-x-1/2 md:w-[60vw]
        bottom-0 w-[98vw] h-16 my-2
        bg-gradient-to-br from-teal-900/50 to-emerald-900/40
        backdrop-blur-xl shadow-lg rounded-xl
        border-t md:border-r border-white/10
      `}
    >
      <nav
        className="
          flex justify-around items-center w-full h-full
          md:py-6 md:gap-8
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
                text-white/80 hover:text-green-400 transition
              "
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "text-green-400" : "text-white"
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
