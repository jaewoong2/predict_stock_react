export const siteConfig = {
  siteName: "SAPM",
  baseUrl: "https://example.com",
  apiBaseUrl: import.meta.env.SEO_API_BASE_URL ?? "https://api.example.com",
  defaultImage: "/default-og.png",
};

export type SiteConfig = typeof siteConfig;
