import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export default function Input({ icon, className, ...props }: InputProps) {
  return (
    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10 focus-within:border-teal-400 transition">
      {icon && <span className="text-teal-300">{icon}</span>}
      <input
        className={`bg-transparent outline-none text-white placeholder-gray-400 w-full ${className}`}
        {...props}
      />
    </div>
  );
}
