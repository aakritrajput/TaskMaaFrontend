"use client";
import { useState } from "react";
import axios from "axios";

export const useMaaHandler = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const triggerMaaResponse = async (type: string) => {
    try {
      setLoading(true);
      setMessage("");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/maa/getResponse/${type}`, {withCredentials: true});
      const msg = res.data?.data || "Maa is thinking...";
      setMessage(msg);

      // message disappears after few seconds
      setTimeout(() => setMessage(""), 10000);
    } catch (err) {
      console.error("Maa API error:", err);
      setMessage("Maa is silent for now 🩷");
    } finally {
      setLoading(false);
    }
  };

  return { message, loading, triggerMaaResponse };
};
