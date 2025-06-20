import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { useMarketForecast } from "@/hooks/useMarketNews";
import { format } from "date-fns";
import { Progress } from "../ui/progress";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useState } from "react";
import { MarketForecastResponse } from "@/types/news";

type Props = {
  title?: string;
};

const MarketForCastCard = ({ title }: Props) => {
  const { date } = useSignalSearchParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState<{
    title: string;
    data: MarketForecastResponse;
  } | null>(null);

  const majorForecastData = useMarketForecast(
    date ?? format(new Date(), "yyyy-MM-dd"),
    "Major"
  );

  const minorForecastData = useMarketForecast(
    date ?? format(new Date(), "yyyy-MM-dd"),
    "Minor"
  );

  const handleForecastClick = (type: "Major" | "Minor") => {
    const data =
      type === "Major" ? majorForecastData.data : minorForecastData.data;
    const forecastTitle =
      type === "Major" ? "Tranditional Forecast" : "Community Forecast";

    if (data) {
      setSelectedForecast({ title: forecastTitle, data });
      setIsDrawerOpen(true);
    }
  };

  const isLoading = majorForecastData.isLoading || minorForecastData.isLoading;
  const error = majorForecastData.error || minorForecastData.error;

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-medium">
            <span>{date}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-24">
          <Loader2 className="animate-spin h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">데이터 로딩 오류</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none gap-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div
          className="cursor-pointer"
          onClick={() => handleForecastClick("Major")}
        >
          <h4 className="text-sm">Tranditional Forecast</h4>
          <div className="relative flex flex-col w-full overflow-hidden">
            <Progress
              value={majorForecastData?.data?.up_percentage}
              className={cn(
                "h-6 relative",
                majorForecastData.data?.outlook === "UP"
                  ? "[&>div]:bg-green-500"
                  : "[&>div]:bg-red-500"
              )}
            />
            <div
              style={{
                transform: `translateX(${
                  (majorForecastData.data?.up_percentage || 0) - 10
                }%)`,
              }}
              className={cn(
                "absolute inset-0 top-0 left-0 flex items-center justify-start text-sm",
                "text-muted"
              )}
            >
              {majorForecastData.data?.up_percentage}%
            </div>
          </div>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => handleForecastClick("Minor")}
        >
          <h4 className="text-sm">Community Forecast</h4>
          <div className="relative flex flex-col w-full overflow-hidden">
            <Progress
              value={minorForecastData.data?.up_percentage}
              className={cn(
                "h-6 relative",
                minorForecastData.data?.outlook === "UP"
                  ? "[&>div]:bg-green-500"
                  : "[&>div]:bg-red-500"
              )}
            />
            <div
              style={{
                transform: `translateX(${
                  (minorForecastData.data?.up_percentage || 0) - 10
                }%)`,
              }}
              className={cn(
                "absolute inset-0 top-0 left-0 flex items-center justify-start text-sm",
                "text-muted"
              )}
            >
              {minorForecastData.data?.up_percentage}%
            </div>
          </div>
        </div>
      </CardContent>

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
              <DrawerTitle>{selectedForecast?.title}</DrawerTitle>
              <DrawerDescription>Forecast for {date}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 z-10">
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="mb-2 font-medium">
                  Outlook: {selectedForecast?.data?.outlook}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Up Percentage: {selectedForecast?.data?.up_percentage}%
                </p>
                <h4>Reason</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedForecast?.data?.reason.replace("\n", "") ||
                    "No specific reason provided."}
                </p>
                <h4 className="mb-2 font-medium">Details</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  This forecast is based on an analysis of various market
                  signals and news articles. The 'UP' outlook suggests a
                  positive trend, while 'DOWN' suggests a negative trend. The
                  percentage indicates the strength of this signal.
                </p>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </Card>
  );
};

export default MarketForCastCard;
