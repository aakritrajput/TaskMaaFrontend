import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({ children, loading, className, ...props }: ButtonProps) {
  return (
    <button
      className={`w-full cursor-pointer bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium py-2 px-4 rounded-xl shadow-lg hover:opacity-90 transition disabled:opacity-50 ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
