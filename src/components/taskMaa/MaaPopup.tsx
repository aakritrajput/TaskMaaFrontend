"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function MaaPopup({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: -80, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="fixed z-50 bottom-16 left-1/2 -translate-x-1/2 bg-white/25 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-lg border border-white/30 max-w-xs text-center"
        >
          <p className="text-sm md:text-base font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
