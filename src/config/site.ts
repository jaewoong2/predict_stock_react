import { Metadata } from "next";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  logo: "https://images.biizbiiz.com/images/biizbiiz_logo.png",
  name: "MEMOO",
  description: "이벤트",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://habbits.biizbiiz.com",
};

export const siteMetadata: Metadata = {
  title: "Habbits | Record Your Habbit With Real Life",
  description: "Record Your Habbit With Real Life",
  keywords: ["Habit", "Tracker", "Habbit Tracker"],
  authors: [{ name: "@Jaewoong2", url: "https://github.com/jaewoong2" }],
  applicationName: "Habbits | Record Your Habbit With Real Life",
  generator: "Next.js 15",
  referrer: "no-referrer",
  openGraph: {
    title: "Habbits | Record Your Habbit With Real Life",
    description: "Record Your Habbit With Real Life",
    url: "https://habbits.biizbiiz.com",
    type: "website",
    siteName: "Habbits | Record Your Habbit With Real Life",
    images: [
      {
        url: "https://images.biizbiiz.com/ramram.png",
        width: 1200,
        height: 630,
        alt: "Habbits | Record Your Habbit With Real Life",
      },
    ],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@biizbiiz",
    creator: "@Jaewoong2",
    title: "Habbits | Record Your Habbit With Real Life",
    description: "Record Your Habbit With Real Life",
    images: ["https://images.biizbiiz.com/ramram.png"],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nocache: false,
  },
};
