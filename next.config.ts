import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },

  env: {
    TZ: "Asia/Seoul",
  },

  async rewrites() {
    // 개발 모드에서만 프록시 활성화 (CORS 우회용)
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/proxy/:path*",
          destination: "http://localhost:8002/:path*",
        },
      ];
    }
    return [];
  },

  assetPrefix:
    process.env.NODE_ENV === "development"
      ? null
      : process.env.DEPLOYMENT_TYPE === "ecs"
        ? null
        : "https://biizbiiz.com",
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "d3t7exr31xs1l7.cloudfront.net" },
      { hostname: "images.biizbiiz.com" },
      { hostname: "static.biizbiiz.com" },
      { hostname: "stock.biizbiiz.com" },
      { hostname: "pef3ppbc4k.execute-api.ap-northeast-2.amazonaws.com" },
      { hostname: "stock-api.biizbiiz.com" },
      { hostname: "biizbiiz.com" },
      { hostname: "biizbiiz.com" },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
