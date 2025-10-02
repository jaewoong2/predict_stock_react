import { MarketNewsItem } from "@/types/news";

export function countRecommendations(items: MarketNewsItem[]) {
  return items.reduce(
    (acc, item) => {
      if (item.recommendation === "Buy") acc.buy++;
      else if (item.recommendation === "Sell") acc.sell++;
      else if (item.recommendation === "Hold") acc.hold++;
      return acc;
    },
    { buy: 0, sell: 0, hold: 0 },
  );
}
