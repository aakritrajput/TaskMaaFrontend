'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full pt-8 pb-20  px-6 max-w-7xl mx-auto text-gray-300 select-none
                       backdrop-blur-xl bg-white/10 border-t border-white/20 rounded-t-3xl"
    >
     <div className='flex flex-col md:flex-row items-center justify-between'>
        
      {/* Logo and branding */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/TaskMaa_logo.png"
          alt="TaskMaa Logo"
          width={36}
          height={36}
          className="rounded-full"
          priority
        />
        <span className="text-white font-semibold text-lg cursor-pointer">TaskMaa</span>
      </Link>

      {/* Navigation */}
      <nav className="flex gap-8 mt-6 md:mt-0 text-white font-semibold text-base">
        <Link href="/" className="hover:text-[#2FAC81] transition">
          Home
        </Link>
        <Link href="/features" className="hover:text-[#2FAC81] transition">
          Features
        </Link>
        <Link href="/about" className="hover:text-[#2FAC81] transition">
          About
        </Link>
        <Link href="/contact" className="hover:text-[#2FAC81] transition">
          Contact
        </Link>
      </nav>

      {/* Social Icons */}
      <div className="flex gap-6 mt-6 md:mt-0 text-white">
        <Link href="https://github.com/aakritrajput" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-[#2FAC81] transition">
          <Github size={22} />
        </Link>
        <Link href="https://www.linkedin.com/in/aakrit-rajput" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#2FAC81] transition">
          <Linkedin size={22} />
        </Link>
        <Link href="mailto:aakritrajpt87@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#2FAC81] transition">
          <Mail size={22} />
        </Link>
      </div>
     </div>
     <div className='flex flex-col mt-4 items-center py-2'>
      <p className='text-gray-200 '>&copy; TaskMaa, All rights reserved.</p>
      <p className='text-gray-200 '>Made by: Aakrit</p>
     </div>
    </footer>
  )
}
