"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import Input from "@/src/components/form/Input";
import Button from "@/src/components/form/Button";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/src/lib/features/auth/AuthSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { RootState } from "@/src/lib/store";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const user = useSelector((state: RootState) => state.auth.user)
  // const [verifyLink, setVerifyLink] = useState<boolean>(false)
  const authStatus = useSelector((state: RootState) => state.auth.authStatus)

   useEffect(() => {
    if (user) {
      router.replace("/user/dashboard"); // replace avoids keeping login in history
    }
  }, [user, router]);

  const onSubmit: SubmitHandler<LoginFormValues> = async(data) => {

    if(authStatus === "ServerDown"){ // update the alert message according to issues..
      alert("TaskMaa's redis upstash caching requests limit has been reached for this month. Therefore please visit maa's personal dashboard when the limit resets. Very sorry for the inconvinece caused !")
      router.push('/')
      return ;
    }

    try {
      setLoading(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`, data, {withCredentials: true})
      console.log('response: ', response)
      dispatch(login(response.data.data))
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        // if(error.status === 402){
        //   setVerifyLink(true);
        // }
      } else {
        setError("An unexpected error occurred");
      }
    }finally{
      setLoading(false)
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

          {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
          {/* {verifyLink && <p className="text-green-400  text-sm"><Link href={'/auth/resendVerificationLink'}  className="text-[#06ad9c]">Resend verification email</Link></p>} */}
          <Button loading={loading} type="submit">Login</Button>
        </form>
        
        <div className="mt-4 flex justify-between text-sm text-gray-300">
          <Link href="/auth/signup" className="text-teal-400 hover:underline cursor-pointer">
            Don&apos;t have an account?
          </Link>
          {/* <Link href="/auth/forgot-password" className="text-teal-400 hover:underline cursor-pointer">
            Forgot Password?
          </Link> */}
        </div>
      </div>

      {/* Personal Quote */}
      <p className="mt-6 text-center text-gray-300 max-w-sm italic">
        &quot;Discipline is love in action. Let TaskMaa guide your steps.&quot;
      </p>
    </div>
  );
}
