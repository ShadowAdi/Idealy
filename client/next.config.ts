import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        {
            hostname: 'image.com'
        },
        {
            hostname: 'images.unsplash.com'
        },
        {
            hostname: 'res.cloudinary.com'
        }
    ]
}
};

export default nextConfig;
