"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ListChecks, Users, MessageSquare, HeartHandshake } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

const navItems = [
  { name: "Dashboard", href: "/user/dashboard", icon: LayoutGrid },
  { name: "Tasks", href: "/user/tasks", icon: ListChecks },
  { name: "Group Tasks", href: "/user/groupTasks", icon: Users },
  { name: "Chat", href: "/user/chat", icon: MessageSquare },
  { name: "Maa", href: "/user/maa", icon: HeartHandshake },
];

export default function SideOrDownBar() {
  const pathname = usePathname();
  const authStatus = useSelector((state: RootState) => state.auth.authStatus)
  return (
    <div
      className={`
        ${authStatus == 'authenticated' ? 'flex md:flex-col' : 'hidden'}
        fixed z-50 left-1/2 -translate-x-1/2 md:w-[60vw]
        bottom-0 w-[98vw] h-16 my-2
        bg-gradient-to-br from-[#00000085] to-[#0000006c]
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
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          console.log('pathname: ', pathname, 'href: ', item.href)
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
                  isActive ? "text-[#e08308]" : "text-white"
                }`}
              />
              <span
                className={`
                  text-[10px] text-center leading-tight
                  ${isActive ? "text-[#e08308] font-bold" : "text-white/70"}
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
