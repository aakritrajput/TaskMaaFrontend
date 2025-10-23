import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

interface RequestOverlayProps {
  requesting: boolean;
  responseFromRequest: string;
  errorFromRequest: string;
  onClose: () => void;
}

const RequestOverlay: React.FC<RequestOverlayProps> = ({
  requesting,
  responseFromRequest,
  errorFromRequest,
  onClose,
}) => {
  const isVisible = requesting || responseFromRequest || errorFromRequest;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-[#0e0e0e]/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-[90%] max-w-sm text-center text-white border border-[#1a1a1a]"
      >
        {/* Close button */}
        {!requesting && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          >
            <X size={22} />
          </button>
        )}

        {/* LOADING STATE */}
        {requesting && (
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Animated dots loader */}
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="w-3 h-3 bg-[#116f6f] rounded-full"
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            <p className="text-[#2b7979] text-lg font-medium tracking-wide">
              Requesting...
            </p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {responseFromRequest && !requesting && !errorFromRequest && (
          <div className="flex flex-col items-center justify-center space-y-3">
            <CheckCircle className="text-[#2b7979] w-10 h-10" />
            <p className="text-[#2b7979] text-lg font-medium">
              {responseFromRequest}
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-[#2b7979] hover:bg-[#3da2a2] cursor-pointer rounded-lg font-medium transition"
            >
              OK
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {errorFromRequest && !requesting && (
          <div className="flex flex-col items-center justify-center space-y-3">
            <XCircle className="text-red-400 w-10 h-10" />
            <p className="text-red-300 text-lg font-medium">
              {errorFromRequest}
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 cursor-pointer rounded-lg font-medium transition"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RequestOverlay;
