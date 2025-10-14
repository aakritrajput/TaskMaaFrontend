"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import Input from "@/src/components/form/Input";
import Button from "@/src/components/form/Button";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { login } from "@/src/lib/features/auth/AuthSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState<string>('')
  const onSubmit: SubmitHandler<LoginFormValues> = async(data) => {
    console.log("Login Data:", data);
    
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', data)
      console.log('response: ', response)
      dispatch(login(response.data.data))
      router.push('/user/dashboard')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
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

          {error && <p className="text-red-400 my-3 text-sm">{error}</p>}

          <Button type="submit">Login</Button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-gray-300">
          <Link href="/auth/signup" className="text-teal-400 hover:underline cursor-pointer">
            Don&apos;t have an account?
          </Link>
          <Link href="/auth/forgot-password" className="text-teal-400 hover:underline cursor-pointer">
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Personal Quote */}
      <p className="mt-6 text-center text-gray-300 max-w-sm italic">
        &quot;Discipline is love in action. Let TaskMaa guide your steps.&quot;
      </p>
    </div>
  );
}
