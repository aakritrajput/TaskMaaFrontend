import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar/Navbar";
import Footer from "@/src/components/Footer";
import { Providers } from "@/src/lib/providers";
import SideOrDownBar from "@/src/components/user/DownBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskMaa",
  description: "An AI powered task management and focus boosting app with mother's guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="bg-gradient-to-b from-[#06161a] via-[#082a2d] to-[#06161a] pt-3">
            <Navbar/>
              <SideOrDownBar/>
              {children}
            <Footer/>
          </div>
        </Providers>
      </body>
    </html>
  );
}
