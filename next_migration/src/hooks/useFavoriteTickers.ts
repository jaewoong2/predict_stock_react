import { useEffect, useState } from "react";

const STORAGE_KEY = "favoriteTickers";

export function useFavoriteTickers() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore write errors
    }
  }, [favorites]);

  const toggleFavorite = (ticker: string) => {
    setFavorites((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker]
    );
  };

  return { favorites, toggleFavorite };
}
