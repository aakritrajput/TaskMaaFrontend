"use client";

import { Heart, AlertTriangle, Trophy, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent text-white relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
    
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">
            Meet Maa — Your Strict but Loving Guide to Goals
          </h1>
          <p className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto">
            She’ll cheer you when you’re winning, scold you when you’re slacking,
            and never let you forget your dreams.
          </p>
        </motion.div>

        {/* Maa’s Personality Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              title: "The Loving Maa",
              icon: <Heart className="w-10 h-10 text-pink-400" />,
              desc: "Motivational messages and celebrations for every milestone you achieve."
            },
            {
              title: "The Strict Maa",
              icon: <AlertTriangle className="w-10 h-10 text-yellow-400" />,
              desc: "Stern reminders when you procrastinate — no excuses allowed!"
            },
            {
              title: "The Competitive Maa",
              icon: <Trophy className="w-10 h-10 text-amber-300" />,
              desc: "Pushes you to outperform friends and be the most sincere of all."
            },
            {
              title: "The Understanding Maa",
              icon: <Handshake className="w-10 h-10 text-green-300" />,
              desc: "Adjusts to your pace and mood while keeping you accountable."
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex"
            >
              <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col items-center text-center space-y-4 hover:scale-105 transition-transform w-full min-h-[220px]">
                {card.icon}
                <h3 className="text-xl font-bold">{card.title}</h3>
                <p className="text-sm text-teal-100 flex-1">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How Maa Works */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            How Maa Works
          </h2>
          <div className="flex flex-col md:flex-row md:items-stretch items-center justify-center gap-8">
            {[
              "Set your goals",
              "Track daily progress",
              "Receive Maa’s AI-powered feedback",
              "Compete or collaborate with friends"
            ].map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center max-w-[180px] flex-1"
              >
                <div className="w-16 h-16 flex-shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg font-bold mb-4">
                  {index + 1}
                </div>
                <p className="text-sm text-teal-100 leading-snug">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-lg text-teal-100 mb-6">
            No more excuses. Maa’s watching. 👀
          </p>
          <Link
            href='/login'
            className="bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold rounded-full px-8 py-3 hover:scale-105 transition-transform"
          >
            Let Maa Guide You
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
