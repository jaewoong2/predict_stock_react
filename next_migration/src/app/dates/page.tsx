"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTickerChanges, useTickers } from "@/hooks/useTicker";
import { TickerChangeResponse } from "@/types/ticker";
import { cn } from "@/lib/utils";

const TickerDates = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setSearchParams = useCallback((params: { symbol?: string; dates?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (params.symbol) {
      newParams.set('symbol', params.symbol);
    } else {
      newParams.delete('symbol');
    }
    if (params.dates) {
      newParams.set('dates', params.dates);
    } else {
      newParams.delete('dates');
    }
    router.push('?' + newParams.toString());
  }, [searchParams, router]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [formattedDates, setFormattedDates] = useState<string[]>([]);

  // 티커 목록 조회
  const { data: tickers, isLoading: isLoadingTickers } = useTickers();

  // URL에서 데이터 추출
  useEffect(() => {
    const symbol = searchParams.get("symbol");
    const dates = searchParams.get("dates");

    if (symbol) {
      setSelectedSymbol(symbol);
    }

    if (dates) {
      try {
        const parsedDates = JSON.parse(dates) as string[];
        setFormattedDates(parsedDates);
        setSelectedDates(parsedDates.map((dateStr) => new Date(dateStr)));
      } catch (error) {
        console.error("날짜 파싱 오류:", error);
      }
    }
  }, [searchParams]);

  // 날짜 배열 업데이트 시 URL 업데이트
  useEffect(() => {
    if (formattedDates.length > 0 || selectedSymbol) {
      const params: { symbol?: string; dates?: string } = {};

      if (selectedSymbol) {
        params.symbol = selectedSymbol;
      }

      if (formattedDates.length > 0) {
        params.dates = JSON.stringify(formattedDates);
      }

      setSearchParams(params);
    }
  }, [formattedDates, selectedSymbol, setSearchParams]);

  // 변화율 데이터 조회
  const { data: tickerChanges, isLoading: isLoadingChanges } = useTickerChanges(
    selectedSymbol && formattedDates.length > 0
      ? { symbol: selectedSymbol, dates: formattedDates }
      : undefined
  );

  // 날짜 선택 처리
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) return;

    // Calendar returns the complete array of selected dates
    // So we can just update our state with the new array
    setSelectedDates(dates);
    setFormattedDates(dates.map((date) => format(date, "yyyy-MM-dd")));
  };

  // 심볼 선택 처리
  const handleSymbolSelect = (value: string) => {
    setSelectedSymbol(value);
  };

  // 차트 데이터 포맷팅
  const chartData =
    tickerChanges?.map((item: TickerChangeResponse) => ({
      date: item.date,
      price: item.price,
      changePercentage: item.change_percentage,
    })) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">티커 날짜별 변화율</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* 티커 선택 */}
        <Card>
          <CardHeader>
            <CardTitle>티커 선택</CardTitle>
            <CardDescription>분석할 주식 티커를 선택하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSymbol} onValueChange={handleSymbolSelect}>
              <SelectTrigger>
                <SelectValue placeholder="티커 선택" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTickers ? (
                  <SelectItem value="loading" disabled>
                    로딩 중...
                  </SelectItem>
                ) : (
                  tickers?.map((ticker) => (
                    <SelectItem key={ticker.id} value={ticker.symbol}>
                      {ticker.symbol} - {ticker.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* 날짜 선택 */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>날짜 선택</CardTitle>
            <CardDescription>
              분석할 날짜들을 선택하세요 (최대 5개)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDates.length > 0
                    ? `${selectedDates.length}개 날짜 선택됨`
                    : "날짜 선택하기"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(date) => handleDateSelect(date)}
                  disabled={(date) =>
                    selectedDates.length >= 5 &&
                    !selectedDates.some(
                      (selectedDate) =>
                        format(selectedDate, "yyyy-MM-dd") ===
                        format(date, "yyyy-MM-dd")
                    )
                  }
                />
              </PopoverContent>
            </Popover>

            {/* 선택된 날짜 표시 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedDates.map((date, index) => (
                <div
                  key={index}
                  className="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm flex items-center"
                >
                  {format(date, "yyyy-MM-dd")}
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      setFormattedDates(
                        formattedDates.filter((d) => d !== dateStr)
                      );
                      setSelectedDates(
                        selectedDates.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 요약 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>요약 정보</CardTitle>
            <CardDescription>선택된 기간 동안의 변화</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingChanges ? (
              <div>데이터 로딩 중...</div>
            ) : tickerChanges && tickerChanges.length > 0 ? (
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">티커:</span> {selectedSymbol}
                </div>
                <div>
                  <span className="font-semibold">선택 날짜:</span>{" "}
                  {formattedDates.length}개
                </div>
                <div>
                  <span className="font-semibold">최대 변화율:</span>{" "}
                  {Math.max(
                    ...tickerChanges.map((item) => item.change_percentage)
                  )?.toFixed(2)}
                  %
                </div>
                <div>
                  <span className="font-semibold">최소 변화율:</span>{" "}
                  {Math.min(
                    ...tickerChanges.map((item) => item.change_percentage)
                  )?.toFixed(2)}
                  %
                </div>
              </div>
            ) : (
              <div>데이터가 없습니다</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 차트 표시 */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>가격 및 변화율 추이</CardTitle>
          <CardDescription>
            선택된 날짜 간의 가격 및 변화율 비교
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoadingChanges ? (
            <div className="flex h-full items-center justify-center">
              데이터 로딩 중...
            </div>
          ) : tickerChanges && tickerChanges.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="price"
                  name="가격"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="changePercentage"
                  name="변화율 (%)"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              {selectedSymbol && formattedDates.length > 0
                ? "해당 날짜에 대한 데이터가 없습니다."
                : "티커와 날짜를 선택하세요."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 상세 데이터 테이블 */}
      {tickerChanges && tickerChanges.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>상세 데이터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">날짜</th>
                    <th className="px-4 py-2 text-left">가격</th>
                    <th className="px-4 py-2 text-left">변화율</th>
                  </tr>
                </thead>
                <tbody>
                  {tickerChanges.map(
                    (item: TickerChangeResponse, index: number) => (
                      <tr
                        key={index}
                        className={cn(
                          "border-b",
                          index % 2 === 0 ? "bg-muted/50" : ""
                        )}
                      >
                        <td className="px-4 py-2">{item.date}</td>
                        <td className="px-4 py-2">${item.price?.toFixed(2)}</td>
                        <td
                          className={cn(
                            "px-4 py-2",
                            item.change_percentage > 0
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {item.change_percentage > 0 ? "+" : ""}
                          {item.change_percentage?.toFixed(2)}%
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TickerDates;
