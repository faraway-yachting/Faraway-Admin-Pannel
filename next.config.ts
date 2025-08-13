import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'awais.thedevapp.online'],
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
  },
  // Removed experimental.optimizeCss as it causes build issues
};

export default nextConfig;
