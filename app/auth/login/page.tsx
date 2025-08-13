"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import Input from "@/src/components/form/Input";
import Button from "@/src/components/form/Button";
import Image from "next/image";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  
  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    console.log("Login Data:", data);
    // TODO: Call backend login API here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4">
      
      {/* Logo + Title */}
      <div className="flex flex-col items-center mb-8">
        <Image priority src='/TaskMaa_logo.png' alt="TaskMaa logo" width={80} height={80} />
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold mt-4">TaskMaa</h1>
      </div>

      {/* Glass Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-white/20">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit">Login</Button>
        </form>

      </div>

      {/* Personal Quote */}
      <p className="mt-6 text-center text-gray-300 max-w-sm italic">
        &quot;Discipline is love in action. Let TaskMaa guide your steps.&quot;
      </p>
    </div>
  );
}
