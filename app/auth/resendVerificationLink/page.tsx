'use client'

import { useForm } from "react-hook-form"
import { useState } from "react";
// import axios from "axios";
import Input from "@/src/components/form/Input";
import Button from "@/src/components/form/Button";
import { Mail } from "lucide-react";
import Image from "next/image";

// ------------- right now for this hobby deploy we are not going to include email verification !! --------------

type formData = {
    email: string;
}

function ResendVerificationLink() {
    const {register, handleSubmit, formState: {errors}} = useForm<formData>();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("");;
    const submitHandler = async(data: {email: string}) => {
      alert('Coming soon...')
        // setLoading(true);
        // setErrorMessage("");
        // setSuccessMessage("");
        // try {
        //     const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/resendVerificationLink/${encodeURIComponent(data.email)}`)
        //     setSuccessMessage(response.data.message)
        // } catch (error) {
        //   console.log('error: ', error)
        //     if (axios.isAxiosError(error) && error.response && error.response.data) {
        //       setErrorMessage(error.response.data);
        //     } else {
        //       setErrorMessage("An unexpected error occurred");
        //     }
        // }finally{
        //     setLoading(false)
        // }
    }
  return (
    <div className="w-full h-[90vh] flex flex-col justify-center items-center bg-transparent">
        {loading && 
        <div className="w-full h-[100vh] inset-0 absolute flex justify-center items-center z-20 bg-[#000000c8]">
            <div className="animate-spin rounded-full h-[8vw] w-[8vw] md:border-t-[6px] border-t-[5px] border-[#20875a]"></div>
        </div>}

      {/* Logo + Title */}
        <div className="flex flex-col items-center mb-8">
          <Image priority src='/TaskMaa_logo.png' alt="TaskMaa logo" width={80} height={80} />
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold mt-4">TaskMaa</h1>
        </div>
        
      <div className="bg-gradient-to-r from-gray-500/20 to-black/20 shadow-lg shadow-black rounded-2xl flex flex-col gap-3 justify-center items-center relative py-8 md:h-[60%] w-[95%] p-2 md:w-[60%]">
        <h1 className="text-[#14937e] lg:text-[35px] md:text-[28px] text-[18px] font-semibold w-full h-[30%] text-center top-6">Resend email verification link</h1>
        <form onSubmit={handleSubmit(submitHandler)} className="m-1 mt-4">
            <Input
              type="email"
              placeholder="Email"
              icon={<Mail size={18} />}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            <Button type="submit" disabled={loading} className="rounded-md my-3 px-4">{loading ? "sending..." : "Send"}</Button>
        </form>
      </div>
    </div>
  )
}

export default ResendVerificationLink
