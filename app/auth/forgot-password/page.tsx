'use client'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Mail } from "lucide-react";
import Input from "@/src/components/form/Input";
import Link from "next/link";
import Image from "next/image";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: ForgotPasswordForm) => {
    console.log(data);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-transparent px-4">

      {/* Logo + Title */}
      <div className="flex flex-col items-center mb-8">
        <Image priority src='/TaskMaa_logo.png' alt="TaskMaa logo" width={80} height={80} />
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold mt-4">TaskMaa</h1>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-400">
          Forgot Password
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Enter your email address to reset your password
        </p>

        {submitted ? (
          <div className="text-center text-green-400">
            Password reset link sent to your email!
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
               <Input
               type="email"
               placeholder="Email"
               icon={<Mail size={18} />}
               {...register("email", { required: "Email is required" })}
               />
              {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg cursor-pointer font-semibold text-white bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {/* Back to login */}
        <div className="text-center mt-6">
          <Link href="/auth/login" className="text-sm text-emerald-400 hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
