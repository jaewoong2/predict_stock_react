"use client";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface MarketNewsCarouselProps {
  items: MarketNewsItem[];
}

export function MarketNewsCarousel({ items }: MarketNewsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<MarketNewsItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate recommendation counts
  const recommendationCounts = items?.reduce(
    (acc, item) => {
      if (item.recommendation === "Buy") acc.buy++;
      else if (item.recommendation === "Sell") acc.sell++;
      else if (item.recommendation === "Hold") acc.hold++;
      return acc;
    },
    { buy: 0, sell: 0, hold: 0 },
  ) || { buy: 0, sell: 0, hold: 0 };

  const total =
    recommendationCounts.buy +
    recommendationCounts.hold +
    recommendationCounts.sell;

  // Chart data for ShadCN pie chart
  const chartData = [
    {
      recommendation: "buy",
      count: recommendationCounts.buy,
      fill: "var(--color-buy)"
    },
    {
      recommendation: "hold", 
      count: recommendationCounts.hold,
      fill: "var(--color-hold)"
    },
    {
      recommendation: "sell",
      count: recommendationCounts.sell,
      fill: "var(--color-sell)"
    }
  ].filter((item) => item.count > 0);

  const chartConfig = {
    buy: { label: "Buy", color: "#e07a5f" },
    hold: { label: "Hold", color: "#3d5a80" },
    sell: { label: "Sell", color: "#81b29a" },
  };


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
        className="flex h-full snap-x space-x-4 overflow-x-auto"
      >
        {/* Enhanced Summary Card */}
        <div className="from-card via-card to-muted/20 border-border/50 flex min-w-[300px] cursor-default snap-start flex-col justify-between rounded-xl border bg-gradient-to-br p-6 shadow-lg backdrop-blur-sm">
          <div>
            <div className="mb-6 flex items-start gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <TrendingUp className="text-primary h-4 w-4" />
              </div>
              <h3 className="text-xl font-bold">뉴스</h3>
            </div>

            {/* Clean Pie Chart */}
            {chartData.length > 0 ? (
              <div className="relative mb-6">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[240px]"
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="recommendation"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      strokeWidth={0}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent nameKey="recommendation" />}
                    />
                  </PieChart>
                </ChartContainer>

                {/* Clean center label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-700">
                      {total}
                    </div>
                    <div className="mt-1 text-sm font-medium text-slate-500">
                      Reports
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 flex h-[200px] items-center justify-center">
                <div className="text-center">
                  <div className="text-muted-foreground mb-2 text-4xl">📊</div>
                  <p className="text-muted-foreground text-sm">
                    No data available
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/30 mt-6 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">
                Total Reports
              </span>
              <span className="text-lg font-bold">{total}</span>
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* News Items */}
        {items?.map((item) => (
          <div
            key={item.id}
            className={cn(
              "bg-card flex min-w-[250px] cursor-pointer snap-start flex-col justify-between rounded-md border p-4 transition-shadow hover:shadow-md",
            )}
            onClick={() => handleItemClick(item)}
          >
            <div>
              <Badge
                className={cn(
                  item.recommendation === "Buy" && "bg-green-500 text-white",
                  item.recommendation === "Sell" && "bg-red-500 text-white",
                  item.recommendation === "Hold" && "bg-yellow-500 text-white",
                  "mb-2",
                )}
              >
                {item.recommendation}
              </Badge>
              <p className="mb-1 text-sm font-semibold">{item.headline}</p>
              <p className="text-muted-foreground line-clamp-3 text-xs">
                {item.summary}
              </p>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 -left-6 hidden -translate-y-1/2 max-sm:hidden"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 -right-6 hidden -translate-y-1/2 max-sm:hidden"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* News Detail Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent
          className="mx-auto h-full max-h-[80vh] w-fit pb-10 !select-text max-sm:max-h-[70vh] max-sm:w-[calc(100%-14px)]"
          data-vaul-drawer-direction={"bottom"}
        >
          <div className="mx-auto h-full w-full max-w-4xl overflow-y-scroll px-6 max-sm:px-1">
            <DrawerHeader>
              <DrawerClose asChild>
                <button className="absolute -top-10 -right-0 cursor-pointer text-3xl text-white">
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
                        "bg-yellow-500 text-white",
                    )}
                  >
                    {selectedItem.recommendation}
                  </Badge>
                )}
              </DrawerTitle>
              <DrawerDescription>
                {selectedItem?.ticker && (
                  <span className="mr-2 font-bold">
                    Ticker: {selectedItem.ticker}
                  </span>
                )}
                {new Date(selectedItem?.created_at || "").toLocaleDateString()}
              </DrawerDescription>
            </DrawerHeader>
            <div className="z-10 p-4 pb-0">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2 font-medium">Summary</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  {selectedItem?.summary}
                </p>
                <h4 className="mb-2 font-medium">Details</h4>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
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
