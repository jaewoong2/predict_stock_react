import { useCallback } from "react";
import { useLocalStorage } from "@/lib/localstorage";

const STORAGE_KEY = "favoriteTickers";

export function useFavoriteTickers() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEY, []);

  const toggleFavorite = useCallback((ticker: string) => {
    setFavorites((prev) =>
      prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker],
    );
  }, [setFavorites]);

  return { favorites, toggleFavorite };
}
