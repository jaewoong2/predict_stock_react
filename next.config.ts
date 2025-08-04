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
  assetPrefix:
    process.env.NODE_ENV === "development" ? null : "https://stock.bamtoly.com",
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "d3t7exr31xs1l7.cloudfront.net" },
      { hostname: "images.bamtoly.com" },
      { hostname: "static.bamtoly.com" },
      { hostname: "stock.bamtoly.com" },
      { hostname: "pef3ppbc4k.execute-api.ap-northeast-2.amazonaws.com" },
      { hostname: "stock-api.bamtoly.com" },
      { hostname: "ai.bamtoly.com" },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
