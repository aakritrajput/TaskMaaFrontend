'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X} from "lucide-react";
import { usePathname } from "next/navigation";
import { /*useDispatch,*/ useSelector } from "react-redux";
import type { RootState } from "../../lib/store";
import { FallbackNavbar } from "./NavbarFallbackUI";
//import { logout } from "../lib/features/auth/AuthSlice";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus)
  const profilePic = useSelector((state: RootState) => state.auth.user?.profilePicture)
  const pathname = usePathname();
//  const dispatch = useDispatch();

  // helper to check active route and return classes
  function linkClass(href: string) {
    const base = "cursor-pointer transition text-xl lg:text-[22px]";
    const active = "text-[#4cdcae]";
    const inactive = "text-white hover:text-[#4cdcae]";
    return pathname === href ? `${base} ${active}` : `${base} ${inactive}`;
  }

// ------  This part is for the navbar of authenticated users -------


  return (
    <div>
    {authStatus === 'loading' &&
    <FallbackNavbar/>
    }
    { authStatus === 'unauthenticated' && 
     <>
      {/* Navbar Container */}
      <div className="mx-auto backdrop-blur-[5px] backdrop-filter px-3 py-2 flex justify-between items-center bg-[rgba(254,254,254,0.1)] h-16 w-[95vw] rounded-[20px] ">
        {/* Logo and Title */}
        <div className="flex gap-2 items-center">
          <Image priority src="/TaskMaa_logo.png" alt="TaskMaa_Logo" width={40} height={40} />
          <h1 className="bg-gradient-to-r from-[#92f9e5] to-[#ffffff] bg-clip-text text-transparent text-2xl font-semibold">TaskMaa</h1>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3.5 lg:gap-6">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/about" className={linkClass("/about")}>About Maa</Link>
          <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
        </div>

        {/* Desktop Login/Signup or Authenticated Links */}
        <div className="hidden md:flex gap-4 items-center">
          <Link
            href="/auth/login"
            className="bg-[#2FAC81] rounded-2xl px-4 py-2 text-white cursor-pointer hover:bg-[#27a26b] transition"
          >
            Login
          </Link>
          <Link href="/auth/signup" className="text-white cursor-pointer px-2 hover:text-[#4cdcae] transition">
            SignUp
          </Link>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md focus:outline-none text-white"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 backdrop-blur-[5px] backdrop-filter bg-[rgba(37,36,36,0.54)] transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full w-[95vw] p-6">
          {/* Top bar with logo and close button */}
          <div className="flex justify-between w-full items-center mb-8">
            <div className="flex gap-2 items-center">
              <Image priority src="/TaskMaa_logo.png" alt="TaskMaa_Logo" width={40} height={40} />
              <h1 className="text-[#4cdcaec4] text-2xl font-semibold">TaskMaa</h1>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-[#4cdcae] focus:outline-none"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-3.5 text-white text-[22px] flex-grow">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={pathname === "/" ? "text-[#4cdcae] cursor-pointer transition" : "cursor-pointer hover:text-[#4cdcae] transition"}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className={pathname === "/about" ? "text-[#4cdcae] cursor-pointer transition" : "cursor-pointer hover:text-[#4cdcae] transition"}
            >
              About Maa
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className={pathname === "/contact" ? "text-[#4cdcae] cursor-pointer transition" : "cursor-pointer hover:text-[#4cdcae] transition"}
            >
              Contact
            </Link>
          </nav>

          {/* Bottom Login/Signup or Auth Links horizontally */}
          <div className="flex gap-4 justify-center items-center mt-auto">
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="bg-[#2FAC81] rounded-2xl px-6 py-2 text-white cursor-pointer hover:bg-[#27a26b] transition text-center flex-1"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setMenuOpen(false)}
              className="text-white cursor-pointer hover:text-[#4cdcae] transition text-center flex-1"
            >
              SignUp
            </Link>
          </div>
        </div>
      </div>
     </>
    }
    {authStatus === 'authenticated' && 
    <>
    {/* Navbar */}
      <div className="mx-auto relative backdrop-blur-[5px] backdrop-filter px-3 py-2 flex justify-between items-center bg-[rgba(254,254,254,0.1)] h-16 w-[95vw] rounded-[20px]">
        <div className="absolute -top-10 -left-10 w-[150px] h-[150px] -z-20 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-[#0cae90] to-[#038cbe]" />
        
        {/* Logo & Title */}
        <div className="flex gap-2 items-center">
          <Image priority src="/TaskMaa_logo.png" alt="TaskMaa_Logo" width={40} height={40} />
          <h1 className="bg-gradient-to-r from-[#92f9e5] to-[#ffffff] bg-clip-text text-transparent text-2xl font-semibold">
            TaskMaa
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Profile Pic */}
          <Link href="/user/profile" className="w-[40px] border-2 border-[#008075] rounded-full h-[40px] overflow-hidden relative">
            <Image fill src={profilePic ?? '/profile/default_profile_pic.jpg'} alt="profile" className="object-cover" />
          </Link>
        </div>
      </div>
    </>
    }
    </div>
  );
}
