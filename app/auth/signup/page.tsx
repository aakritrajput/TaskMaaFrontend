"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";
import Input from "@/src/components/form/Input";
import Button from "@/src/components/form/Button";
import Link from "next/link";
import Image from "next/image";

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormValues>();
  const passwordValue = watch("password"); // To compare with confirm password

  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    console.log("Signup Data:", data);
    // TODO: Call backend signup API
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center my-3 sm:my-1 bg-transparent px-4">

      {/* Logo + Title */}
      <div className="flex flex-col items-center mb-8">
        <Image priority src='/TaskMaa_logo.png' alt="TaskMaa logo" width={80} height={80} />
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold mt-4">TaskMaa</h1>
      </div>

      {/* Glass Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-white/20">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Create Your Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            icon={<User size={18} />}
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <p className="text-red-400 text-sm">{errors.username.message}</p>}

          <Input
            type="email"
            placeholder="Email"
            icon={<Mail size={18} />}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}

          <Input
            type="password"
            placeholder="Password"
            icon={<Lock size={18} />}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}

          <Input
            type="password"
            placeholder="Confirm Password"
            icon={<Lock size={18} />}
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) => value === passwordValue || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>}

          <Button type="submit">Sign Up</Button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-gray-300">
          <Link href="/auth/login" className="text-teal-400 hover:underline cursor-pointer">
            Already have an account?
          </Link>
          <Link href="/auth/forgot-password" className="text-teal-400 hover:underline cursor-pointer">
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Personal Quote */}
      <p className="mt-6 text-center text-gray-300 max-w-sm italic">
        &quot;Consistency beats motivation. TaskMaa keeps you on track.&quot;
      </p>
    </div>
  );
}
