/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Demo-mode photos are generated SVGs served from /api/demo-photo.
    unoptimized: process.env.NEXT_PUBLIC_DEMO === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
