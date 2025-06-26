import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { useMarketForecast } from "@/hooks/useMarketNews";
import { format } from "date-fns";
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
import { CardSkeleton } from "../ui/skeletons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type Props = {
  title?: string;
};

const MarketForCastCard = ({ title }: Props) => {
  const { date } = useSignalSearchParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState<{
    title: string;
    data: MarketForecastResponse[];
    type: "Major" | "Minor";
  } | null>(null);

  const majorForecastQuery = useMarketForecast(
    date ?? format(new Date(), "yyyy-MM-dd"),
    "Major"
  );

  const minorForecastQuery = useMarketForecast(
    date ?? format(new Date(), "yyyy-MM-dd"),
    "Minor"
  );

  const majorForecastData = majorForecastQuery.data || [];
  const minorForecastData = minorForecastQuery.data || [];

  // 차트에 사용할 데이터 구성
  const chartData = majorForecastData.map((item, index) => {
    const minorItem = minorForecastData[index] || {};

    return {
      date: format(new Date(item.date_yyyymmdd), "MM/dd"),
      majorOutlook:
        item.outlook === "UP"
          ? item.up_percentage || 0
          : -(100 - (item.up_percentage || 0)),
      minorOutlook:
        minorItem.outlook === "UP"
          ? minorItem.up_percentage || 0
          : -(100 - (minorItem.up_percentage || 0)),
      majorDirection: item.outlook,
      minorDirection: minorItem.outlook,
    };
  });

  const handleForecastClick = (type: "Major" | "Minor") => {
    const data = type === "Major" ? majorForecastData : minorForecastData;
    const forecastTitle =
      type === "Major" ? "전통적 시장 예측" : "커뮤니티 시장 예측";

    if (data && data.length > 0) {
      setSelectedForecast({ title: forecastTitle, data, type });
      setIsDrawerOpen(true);
    }
  };

  const isLoading =
    majorForecastQuery.isLoading || minorForecastQuery.isLoading;
  const error = majorForecastQuery.error || minorForecastQuery.error;

  if (isLoading) {
    return (
      <CardSkeleton
        titleHeight={6}
        cardClassName="shadow-none"
        contentHeight={140}
      />
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

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const [major, minor] = payload;
      return (
        <div className="bg-background p-3 rounded-lg shadow-md border space-y-1">
          <p className="text-sm font-medium">날짜: {label}</p>
          {major && (
            <p className="text-sm text-emerald-500">
              전통적 예측: {Math.abs(Number(major.value))}%
            </p>
          )}
          {minor && (
            <p className="text-sm text-blue-500">
              커뮤니티 예측: {Math.abs(Number(minor.value))}%
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis
                domain={[-100, 100]}
                tickFormatter={(value) => `${Math.abs(value)}%`}
                label={{
                  value: "예측 확률",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                payload={[
                  { value: "전통적 예측", type: "line", color: "#10b981" },
                  { value: "커뮤니티 예측", type: "line", color: "#3b82f6" },
                ]}
              />
              <Line
                type="monotone"
                dataKey="majorOutlook"
                name="전통적 예측"
                stroke="#10b981"
                activeDot={{ r: 5 }}
                onClick={() => handleForecastClick("Major")}
              />
              <Line
                type="monotone"
                dataKey="minorOutlook"
                name="커뮤니티 예측"
                stroke="#3b82f6"
                activeDot={{ r: 5 }}
                onClick={() => handleForecastClick("Minor")}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-2 justify-around text-sm">
          <div
            className="cursor-pointer flex items-center px-3 py-1 bg-muted/50 rounded-md hover:bg-muted transition-colors"
            onClick={() => handleForecastClick("Major")}
          >
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span>전통적 예측 상세보기</span>
          </div>

          <div
            className="cursor-pointer flex items-center px-3 py-1 bg-muted/50 rounded-md hover:bg-muted transition-colors"
            onClick={() => handleForecastClick("Minor")}
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>커뮤니티 예측 상세보기</span>
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
              {selectedForecast?.data && selectedForecast.data.length > 0 && (
                <div className="space-y-4">
                  {selectedForecast.data.map((forecast, i) => (
                    <div key={i} className="rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-2 font-medium flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-block w-3 h-3 rounded-full",
                            forecast.outlook === "UP"
                              ? "bg-green-500"
                              : "bg-red-500"
                          )}
                        ></span>
                        예측: {forecast.outlook === "UP" ? "상승" : "하락"}
                        <span className="text-sm text-muted-foreground">
                          ({forecast.up_percentage}%)
                        </span>
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        날짜:{" "}
                        {format(new Date(forecast.date_yyyymmdd), "yyyy-MM-dd")}
                      </p>
                      <h4>근거</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                        {forecast.reason ||
                          "특별한 이유가 제공되지 않았습니다."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </Card>
  );
};

export default MarketForCastCard;
