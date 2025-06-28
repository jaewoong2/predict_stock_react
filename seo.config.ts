export const siteConfig = {
  siteName: "SAPM",
  baseUrl: "https://example.com",
  apiBaseUrl: process.env.SEO_API_BASE_URL ?? "https://api.example.com",
  defaultImage: "/default-og.png",
};

export type SiteConfig = typeof siteConfig;
