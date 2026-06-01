import type { NextConfig } from "next";
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',  // covers any S3 bucket
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // your placeholder
      },
    ],
  },
};

export default nextConfig;
