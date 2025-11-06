'use client'

import { useForm } from "react-hook-form";
import { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";

type FormData = {
  name: string;
  email: string;
  message: string;
};

// const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    // if (!captchaToken) {
    //   setStatus("Please verify you are not a robot.");
    //   return;
    // }

    setLoading(true);

    // TEMPORARY: No backend yet, so here i am simulate sending
    setTimeout(() => {
      // console.log("Form Data:", { ...data, captchaToken });
      console.log("data: ", data)
      // setStatus("Message captured! (Will be sent when backend is ready)");
      alert("The contact feature will soon be implemented !!")
      reset();
      // setCaptchaToken(null);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">Contact TaskMaa</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            {...register("name", { required: "Name is required" })}
            className="w-full p-3 rounded-lg focus:outline-[#27a26b] focus:outline-2 bg-white/20 placeholder-gray-300 outline-0"
          />
          {errors.name && <span className="text-red-400">{errors.name.message}</span>}

          {/* Email */}
          <input
            type="email"
            placeholder="Your Email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-3 rounded-lg focus:outline-[#27a26b] focus:outline-2 bg-white/20 placeholder-gray-300 outline-0"
          />
          {errors.email && <span className="text-red-400">{errors.email.message}</span>}

          {/* Message */}
          <textarea
            placeholder="Your Message"
            {...register("message", { required: "Message is required" })}
            className="w-full p-3 rounded-lg focus:outline-[#27a26b] focus:outline-2 bg-white/20 placeholder-gray-300 outline-0 h-28"
          />
          {errors.message && <span className="text-red-400">{errors.message.message}</span>}


          {/* Google reCAPTCHA (currently not verified server-side) */}
          {/* <ReCAPTCHA
            sitekey={siteKey}
            onChange={(token) => setCaptchaToken(token)}
          /> */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-teal-500 hover:bg-teal-600 cursor-pointer rounded-lg font-bold transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Status Message */}
        {status && <p className="mt-4 text-center">{status}</p>}
      </div>
    </div>
  );
}
