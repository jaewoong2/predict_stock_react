import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MarketNewsItem } from "@/types/news";
import { Button } from "@/components/ui/button";

interface MarketNewsCarouselProps {
  items: MarketNewsItem[];
}

export function MarketNewsCarousel({ items }: MarketNewsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: dir === "left" ? -(scrollAmount / 2) : scrollAmount / 2,
      behavior: "smooth",
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 pb-4 snap-x"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="min-w-[250px] snap-start bg-card rounded-md p-4 border"
          >
            <p className="text-sm font-semibold mb-1">{item.headline}</p>
            <p className="text-xs text-muted-foreground line-clamp-3">
              {item.summary}
            </p>
            <p className="text-xs mt-2 text-muted-foreground">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-6 top-1/2 -translate-y-1/2"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-6 top-1/2 -translate-y-1/2"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
