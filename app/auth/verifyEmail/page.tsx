'use client'
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState , useCallback} from "react";


function VerifyEmail() {
    
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || '';
    const token = searchParams.get("token") || '';

    const verifyEmail = useCallback(async() => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        const verificationLink = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register/verify-token?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
        try {
            const response = await axios.get(verificationLink)
            setSuccessMessage(response.data.message)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
              setErrorMessage(error.response.data.message);
            } else {
              setErrorMessage("An unexpected error occurred");
            }
        }finally{
            setLoading(false)
        }
    }, [email, token])

    useEffect(()=>{
        if(email && token){
            verifyEmail();
        }else{
            setErrorMessage("Invalid verification link !!")
        }
    }, [email, token, verifyEmail])

  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-transparent">
        {loading && 
        <div className="w-full inset-0 h-[100vh] absolute flex justify-center items-center z-20 bg-[#000000c8]">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] md:border-t-[6px] border-t-[5px] border-[#118e6c]"></div>
        </div>}
      <div className="flex flex-col items-center mb-5">
        <Image priority src='/TaskMaa_logo.png' alt="TaskMaa logo" width={80} height={80} />
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold mt-4">TaskMaa</h1>
      </div>
      <div className="bg-gradient-to-r from-gray-400/20 to-black/20 shadow-lg shadow-black rounded-2xl flex flex-col  justify-center items-center w-[95%]  py-8 h-[60%] md:w-[60%]">
       {successMessage && 
       <div className="flex flex-col justify-center items-center text-[22px] md:text-[32px]">

        <h1 className="text-[23px] md:text-[30px] text-[gray]">Your email is successfully verified !!</h1>
        <Link href="/auth/login" className="px-3 py-2 rounded-md bg-[#1a9973] text-white">Login</Link>
       </div>}
       {errorMessage && <div className="flex flex-col justify-center items-center ">
        <h1 className="text-[black] font-semibold text-[23px] md:text-[40px]">{errorMessage}</h1>
        </div>}
      </div>
    </div>
  )
}

export default VerifyEmail
