"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SignalData } from "../../types/signal";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button"; // Shadcn UI의 Button 임포트 경로 확인 필요
import { Badge } from "@/components/ui/badge"; // Shadcn UI의 Badge 임포트 경로 확인 필요
import { cn } from "@/lib/utils";

// Helper function to format date string
const formatCurrency = (amount: number | undefined | null) => {
  if (!amount) return "N/A"; // undefined와 null 모두 체크
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // 통화는 실제 데이터에 맞게 조정
  }).format(amount);
};

export const columns: ColumnDef<SignalData>[] = [
  {
    accessorKey: "signal.ticker",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          티커
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.original.signal.ticker}</div> // 기본 왼쪽 정렬
    ),
  },
  {
    accessorKey: "signal.strategy",
    header: "전략",
    cell: ({ row }) => row.original.signal.strategy ?? "N/A", // 기본 왼쪽 정렬
  },
  {
    accessorKey: "signal.action",
    header: ({ column }) => {
      // 정렬 기능 추가
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          액션
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const action = row.original.signal.action;
      if (!action) return <Badge variant="outline">N/A</Badge>; // Badge는 기본적으로 내용에 따라 정렬
      return (
        <Badge
          className={cn(
            action.toLowerCase() === "buy"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          )}
        >
          {action.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "signal.entry_price",
    header: "진입 가격",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {" "}
          {/* text-right 제거 */}
          {formatCurrency(row.original.signal.entry_price)}
        </div>
      );
    },
  },
  {
    id: "take_profit_buy",
    header: "익절가격",
    cell: ({ row }) => {
      const { signal } = row.original;
      return (
        <div className="font-medium">
          {" "}
          {/* text-right 제거 */}
          {formatCurrency(signal.take_profit)}
        </div>
      );
    },
  },
  {
    id: "stop_loss_sell",
    header: "손절가격",
    cell: ({ row }) => {
      const { signal } = row.original;
      return (
        <div className="font-medium">
          {" "}
          {/* text-right 제거 */}
          {formatCurrency(signal.stop_loss)}
        </div>
      );
    },
  },
  {
    accessorKey: "signal.probability",
    header: ({ column }) => {
      // 정렬 기능 추가
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          확률
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const probability = row.original.signal.probability;
      if (!probability) return <Badge variant="outline">N/A</Badge>; // Badge는 기본적으로 내용에 따라 정렬
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "secondary";
      if (probability.toLowerCase() === "high") variant = "default";
      else if (probability.toLowerCase() === "low") variant = "destructive";
      return <Badge variant={variant}>{probability}</Badge>;
    },
  },
  {
    accessorKey: "result.is_correct",
    header: "결과 (정확도)",
    cell: ({ row }) => {
      const isCorrect = row.original.result?.is_correct;
      if (isCorrect == null) return <Badge variant="outline">N/A</Badge>; // Badge는 기본적으로 내용에 따라 정렬
      return isCorrect ? (
        <Badge
          variant="default"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          성공
        </Badge>
      ) : (
        <Badge variant="destructive">실패</Badge>
      );
    },
  },
  {
    accessorKey: "result.price_diff",
    header: "가격 변화",
    cell: ({ row }) => {
      const priceDiff = row.original.result?.price_diff;
      return (
        <div className="font-medium">
          {" "}
          {/* text-right 제거 */}
          {formatCurrency(priceDiff)}
        </div>
      );
    },
  },
];
