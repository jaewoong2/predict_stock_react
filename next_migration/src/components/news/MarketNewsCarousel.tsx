import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MarketNewsItem } from "@/types/news";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MarketNewsCarouselProps {
  items: MarketNewsItem[];
}

export function MarketNewsCarousel({ items }: MarketNewsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<MarketNewsItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const scroll = (dir: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: dir === "left" ? -(scrollAmount / 2) : scrollAmount / 2,
      behavior: "smooth",
    });
  };

  const handleItemClick = (item: MarketNewsItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 snap-x h-full"
      >
        {items?.map((item) => (
          <div
            key={item.id}
            className={cn(
              "min-w-[250px] snap-start bg-card rounded-md p-4 border justify-between flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            )}
            onClick={() => handleItemClick(item)}
          >
            <div>
              <Badge
                className={cn(
                  item.recommendation === "Buy" && "bg-green-500 text-white",
                  item.recommendation === "Sell" && "bg-red-500 text-white",
                  item.recommendation === "Hold" && "bg-yellow-500 text-white",
                  "mb-2"
                )}
              >
                {item.recommendation}
              </Badge>
              <p className="text-sm font-semibold mb-1">{item.headline}</p>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {item.summary}
              </p>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-6 top-1/2 -translate-y-1/2 max-sm:hidden hidden"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-6 top-1/2 -translate-y-1/2 max-sm:hidden hidden"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* News Detail Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent
          className="w-fit mx-auto pb-10 !select-text h-full max-h-[80vh] max-sm:w-[calc(100%-14px)] max-sm:max-h-[70vh]"
          data-vaul-drawer-direction={"bottom"}
        >
          <div className="mx-auto w-full max-w-4xl h-full overflow-y-scroll px-6 max-sm:px-1">
            <DrawerHeader>
              <DrawerClose asChild>
                <button className="text-3xl text-white absolute -right-0 -top-10 cursor-pointer">
                  &times;
                </button>
              </DrawerClose>
              <DrawerTitle>
                {selectedItem?.headline}
                {selectedItem?.recommendation && (
                  <Badge
                    className={cn(
                      "ml-2",
                      selectedItem.recommendation === "Buy" &&
                        "bg-green-500 text-white",
                      selectedItem.recommendation === "Sell" &&
                        "bg-red-500 text-white",
                      selectedItem.recommendation === "Hold" &&
                        "bg-yellow-500 text-white"
                    )}
                  >
                    {selectedItem.recommendation}
                  </Badge>
                )}
              </DrawerTitle>
              <DrawerDescription>
                {selectedItem?.ticker && (
                  <span className="font-bold mr-2">
                    Ticker: {selectedItem.ticker}
                  </span>
                )}
                {new Date(selectedItem?.created_at || "").toLocaleDateString()}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 z-10">
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="mb-2 font-medium">Summary</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedItem?.summary}
                </p>
                <h4 className="mb-2 font-medium">Details</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedItem?.detail_description}
                </p>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
