"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
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
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie } from "recharts";

interface MarketNewsCarouselProps {
  items: MarketNewsItem[];
}

export function MarketNewsCarousel({ items }: MarketNewsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<MarketNewsItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterRecommendation, setFilterRecommendation] = useState<
    string | null
  >(null);

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
      recommendation: "Buy",
      count: recommendationCounts.buy,
      fill: "var(--color-buy)",
    },
    {
      recommendation: "Hold",
      count: recommendationCounts.hold,
      fill: "var(--color-hold)",
    },
    {
      recommendation: "Sell",
      count: recommendationCounts.sell,
      fill: "var(--color-sell)",
    },
  ].filter((item) => item.count > 0);

  const chartConfig = {
    buy: { label: "Buy", color: "oklch(72.3% 0.219 149.579)" },
    hold: { label: "Hold", color: "oklch(79.5% 0.184 86.047)" },
    sell: { label: "Sell", color: "oklch(63.7% 0.237 25.331)" },
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

  const handlePieClick = (data: any) => {
    const recommendation = data.recommendation;
    setFilterRecommendation(
      filterRecommendation === recommendation ? null : recommendation,
    );
  };

  // Filter items based on selected recommendation
  const filteredItems = filterRecommendation
    ? items?.filter((item) => item.recommendation === filterRecommendation)
    : items;

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
                {/* Clean center label */}
                <div className="absolute inset-0 top-1/2 left-1/2 flex h-fit w-fit -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-700">
                      {total}
                    </div>
                    <div className="mt-1 text-sm font-medium text-slate-500">
                      News
                    </div>
                  </div>
                </div>

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
                      strokeWidth={2}
                      stroke="rgba(255,255,255,0.2)"
                      onClick={handlePieClick}
                      style={{ cursor: "pointer" }}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const label =
                            data.recommendation === "Buy"
                              ? "Buy"
                              : data.recommendation === "Sell"
                                ? "Sell"
                                : "Hold";
                          const percentage = (
                            (data.count / total) *
                            100
                          ).toFixed(1);
                          return (
                            <div className="bg-background border-border/50 z-10 rounded-lg border p-3 shadow-lg backdrop-blur-sm">
                              <div className="mb-1 flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: data.fill }}
                                />
                                <p className="text-foreground font-semibold">
                                  {label}
                                </p>
                              </div>
                              <p className="text-muted-foreground text-sm">
                                {data.count} ({percentage}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ChartContainer>
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
        </div>

        {/* News Items */}
        {filteredItems?.map((item) => (
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
