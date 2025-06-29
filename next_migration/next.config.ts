import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    TZ: "Asia/Seoul",
  },
  /* config options here */
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination:
        process.env.NODE_ENV === "development"
          ? `http://localhost:3001/api/:path*`
          : "https://api-habbits.bamtoly.com/api/:path*",
    },
  ],
  assetPrefix:
    process.env.NODE_ENV === "development"
      ? undefined
      : "https://static-habbits.bamtoly.com",
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "d3t7exr31xs1l7.cloudfront.net" },
      { hostname: "images.bamtoly.com" },
      { hostname: "static.bamtoly.com" },
      { hostname: "static-habbits.bamtoly.com" },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
