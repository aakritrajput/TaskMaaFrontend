"use client";

import { motion } from "framer-motion";

export default function TaskMaaLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#06161a] via-[#082d2d] to-[#06161a] z-[9999]">
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-[#116f6f] rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
