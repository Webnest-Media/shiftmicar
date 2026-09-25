import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "shiftmicar.vercel.app",
        pathname: "/uploads/**",
      },
      // ✅ Production backend – update to your actual API domain
      {
        protocol: "https",
        hostname: "api.shiftmycar.in",
        pathname: "/uploads/**",
      },
      // ✅ Allow any subdomain of shiftmycar.in for flexibility
      {
        protocol: "https",
        hostname: "**.shiftmycar.in",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
