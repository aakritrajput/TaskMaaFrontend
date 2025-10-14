"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";
import Input from "@/src/components/form/Input";
import Button from "@/src/components/form/Button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<SignupFormValues>();
  const passwordValue = watch("password"); // To compare with confirm password
  const [error, setError] = useState<string>('')

  const router = useRouter()

  const onSubmit: SubmitHandler<SignupFormValues> = async(data) => {
    console.log("Signup Data:", data);
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', data)
      console.log('response: ', response)
      if(response.data == 'OK'){ // it is obvious but still for double check 😅
        reset();
        router.push('/auth/login')
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
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

          {error && <p className="text-red-400 my-3 text-sm">{error}</p>}

          <Button type="submit">Sign Up</Button>
        </form>

        <div className="mt-4 flex justify-center text-sm text-gray-300">
          <Link href="/auth/login" className="text-teal-400 hover:underline cursor-pointer">
            Already have an account?
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
