import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "**", // allows all folders under res.cloudinary.com
      },
    ],
  },
};

export default nextConfig;
