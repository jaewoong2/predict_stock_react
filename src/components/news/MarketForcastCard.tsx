"use client";
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
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  title?: string;
};

const MarketForCastCard = ({ title }: Props) => {
  const { date } = useSignalSearchParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState<{
    date: string;
    major: MarketForecastResponse | null;
    minor: MarketForecastResponse | null;
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
      majorOutlook: item.up_percentage ?? 0,
      minorOutlook: minorItem.up_percentage ?? 0,
      majorDirection: item.outlook,
      minorDirection: minorItem.outlook,
    };
  });

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
              전문가 예측: {Math.abs(Number(major.value))}%
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
      <CardContent className="flex flex-col gap-4 px-0">
        <div className="w-full h-[200px] flex justify-center items-center">
          <ResponsiveContainer
            width="100%"
            height="100%"
            className="translate-x-[8px]"
          >
            <LineChart
              onClick={(event) => {
                if (event.activePayload && event.activePayload[0]) {
                  const clickedData = event.activePayload[0].payload;
                  const clickedDate = clickedData.date;

                  // 선택된 날짜의 원본 형식 찾기
                  const originalDateFormat = majorForecastData.find(
                    (item) =>
                      format(new Date(item.date_yyyymmdd), "MM/dd") ===
                      clickedDate
                  )?.date_yyyymmdd;

                  if (originalDateFormat) {
                    // 해당 날짜의 Major와 Minor 예측 찾기
                    const majorData = majorForecastData.filter(
                      (item) =>
                        format(new Date(item.date_yyyymmdd), "MM/dd") ===
                        clickedDate
                    );

                    const minorData = minorForecastData.filter(
                      (item) =>
                        format(new Date(item.date_yyyymmdd), "MM/dd") ===
                        clickedDate
                    );

                    // 상태 업데이트 및 Drawer 열기
                    setSelectedForecast({
                      date: originalDateFormat,
                      major: majorData.length > 0 ? majorData[0] : null,
                      minor: minorData.length > 0 ? minorData[0] : null,
                    });
                    setIsDrawerOpen(true);
                  }
                }
              }}
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.8} />
              <XAxis
                dataKey="date"
                className="text-xs stroke-black text-black"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="majorOutlook"
                name="전문가 예측"
                stroke="#10b981"
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="minorOutlook"
                name="커뮤니티 예측"
                stroke="#3b82f6"
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
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
              <DrawerTitle>시장 예측 세부정보</DrawerTitle>
              <DrawerDescription>
                {selectedForecast?.date
                  ? format(new Date(selectedForecast.date), "yyyy-MM-dd")
                  : date}{" "}
                날짜 예측
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 z-10">
              {selectedForecast && (
                <div className="space-y-6">
                  {/* 전문가 시장 예측 섹션 */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-emerald-500">
                      전문가 시장 예측
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <h4 className="mb-2 font-medium flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-block w-3 h-3 rounded-full",
                              selectedForecast.major?.outlook === "UP"
                                ? "bg-green-500"
                                : "bg-red-500"
                            )}
                          ></span>
                          예측:{" "}
                          {selectedForecast.major?.outlook === "UP"
                            ? "상승"
                            : "하락"}
                          <span className="text-sm text-muted-foreground">
                            ({selectedForecast.major?.up_percentage}%)
                          </span>
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          날짜:{" "}
                          {format(
                            new Date(
                              selectedForecast.major?.date_yyyymmdd ?? ""
                            ),
                            "yyyy-MM-dd"
                          )}
                        </p>
                        <h4>근거</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                          {selectedForecast.major?.reason ||
                            "특별한 이유가 제공되지 않았습니다."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 커뮤니티 시장 예측 섹션 */}
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-blue-500">
                      커뮤니티 시장 예측
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <h4 className="mb-2 font-medium flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-block w-3 h-3 rounded-full",
                              selectedForecast.minor?.outlook === "UP"
                                ? "bg-green-500"
                                : "bg-red-500"
                            )}
                          ></span>
                          예측:{" "}
                          {selectedForecast.minor?.outlook === "UP"
                            ? "상승"
                            : "하락"}
                          <span className="text-sm text-muted-foreground">
                            ({selectedForecast.minor?.up_percentage}%)
                          </span>
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          날짜:{" "}
                          {format(
                            new Date(
                              selectedForecast.minor?.date_yyyymmdd ?? ""
                            ),
                            "yyyy-MM-dd"
                          )}
                        </p>
                        <h4>근거</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                          {selectedForecast.minor?.reason ||
                            "특별한 이유가 제공되지 않았습니다."}
                        </p>
                      </div>
                    </div>
                  </div>
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
