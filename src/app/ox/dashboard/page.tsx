import { DashboardPageClient } from "@/components/ox/dashboard/DashboardPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "O/X Game Dashboard | Spam",
  description: "Play O/X prediction game with AI-forecasted stock prices and test your market prediction skills.",
  keywords: [
    "stock game",
    "O/X prediction",
    "stock forecast game",
    "AI prediction",
    "market prediction",
    "stock price game",
  ],
  authors: [{ name: "Spam Finance" }],
  category: "Finance",
  creator: "Spam Finance Team",
  publisher: "Spam Finance",
  robots: "index, follow",
  alternates: {
    canonical: "https://stock.bamtoly.com/ox/dashboard",
  },
  openGraph: {
    title: "O/X Game Dashboard | Spam",
    description: "Play O/X prediction game with AI-forecasted stock prices and test your market prediction skills.",
    url: "https://stock.bamtoly.com/ox/dashboard",
    siteName: "Spam Finance",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://stock.bamtoly.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spam Finance O/X Game Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "O/X Game Dashboard | Spam",
    description: "Play O/X prediction game with AI-forecasted stock prices and test your market prediction skills.",
    images: ["https://stock.bamtoly.com/twitter-image.jpg"],
    creator: "@spamfinance",
  },
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
