"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getPopularStocks } from "@/services/tickerService";
import { StockData } from "@/types/ticker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CardSkeleton } from "../ui/skeletons";

type Props = {
  date: string;
  viewType?: "card" | "table";
};

export function PopularStocksList({ date, viewType = "table" }: Props) {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stocksData = await getPopularStocks({
          direction: "desc",
          limit: 20,
          field: "close_change",
          target_date: date,
        });
        setData(stocksData || []);
      } catch (error) {
        console.error("Failed to fetch popular stocks:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  if (loading) {
    return <LoadingState />;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full shadow-none">
        <CardHeader>
          <CardTitle>종목</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">정보를 가져오지 못하였습니다.</div>
        </CardContent>
      </Card>
    );
  }

  return viewType === "card" ? (
    <PopularStocksCard data={data} />
  ) : (
    <PopularStocksTable
      data={data}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      setCurrentPage={setCurrentPage}
    />
  );
}

function PopularStocksCard({ data }: { data: StockData[] }) {
  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle>인기 종목</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <LoadingState />
        ) : (
          <div className="space-y-3">
            {data.map((stock) => (
              <StockItem key={stock.symbol} stock={stock} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PopularStocksTable({
  data,
  currentPage,
  itemsPerPage,
  setCurrentPage,
}: {
  data: StockData[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
}) {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const router = useRouter();

  const onClickSymbol = (symbol: string) => {
    router.push(`/dashboard/d/${symbol}?model=GOOGLE`);
  };

  return (
    <Card className="w-full shadow-none">
      <CardHeader>종목 변화율</CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>종목</TableHead>
              <TableHead>증가율</TableHead>
              <TableHead className="text-right">거래량 증가율</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((stock) => {
              const { symbol, close_price, price_change, volume_change } =
                stock;
              const isPriceUp = price_change > 0;
              const isPriceDown = price_change < 0;
              const isVolumeUp = volume_change > 0;
              const priceChangeColor = isPriceUp
                ? "text-green-500"
                : isPriceDown
                  ? "text-red-500"
                  : "text-gray-500";

              const formattedPrice = close_price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              const formattedPriceChange = `${isPriceUp ? "+" : ""}${price_change.toFixed(2)}%`;
              const formattedVolumeChange = `${isVolumeUp ? "+" : ""}${volume_change.toFixed(2)}%`;

              return (
                <TableRow
                  key={symbol}
                  onClick={() => onClickSymbol(symbol)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{symbol}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{formattedPrice}</span>
                      <span className={cn(priceChangeColor, "text-xs")}>
                        {formattedPriceChange}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formattedVolumeChange}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* 페이지네이션 UI */}
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // 처음 페이지, 마지막 페이지, 현재 페이지 및 그 주변 페이지만 표시
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }

              // 현재 페이지와 첫 페이지 사이에 간격이 있을 경우 ... 표시
              if (page === 2 && currentPage > 3) {
                return (
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              // 현재 페이지와 마지막 페이지 사이에 간격이 있을 경우 ... 표시
              if (page === totalPages - 1 && currentPage < totalPages - 2) {
                return (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <CardSkeleton
      titleHeight={6}
      cardClassName="shadow-none"
      contentHeight={140}
    />
  );
}

type StockItemProps = {
  stock: StockData;
};

function StockItem({ stock }: StockItemProps) {
  const { symbol, close_price, price_change, volume } = stock;

  // 가격 변화에 따른 스타일 설정
  const isPriceUp = price_change > 0;
  const isPriceDown = price_change < 0;
  const isVolumeUp = volume > 0; // 거래량이 증가한 경우

  const priceChangeColor = isPriceUp
    ? "text-red-500"
    : isPriceDown
      ? "text-blue-500"
      : "text-gray-500";

  // 숫자 포맷팅
  const formattedPrice = close_price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedPriceChange = `${isPriceUp ? "+" : ""}${price_change.toFixed(2)}%`;
  const formattedVolumeChange = `${isVolumeUp ? "+" : ""}${volume.toLocaleString()}주`;

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <span className="font-medium">{symbol}</span>
        </div>
      </div>
      <div className="flex flex-col items-end text-sm">
        <span>{formattedPrice}</span>
        <span className={cn(priceChangeColor)}>{formattedPriceChange}</span>
        <span className="text-right text-gray-600">
          {formattedVolumeChange}
        </span>
      </div>
    </div>
  );
}
