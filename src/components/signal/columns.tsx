"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SignalData } from "../../types/signal";
import { ArrowUpDown, Star } from "lucide-react";
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

export const createColumns = (
  favorites: string[],
  toggleFavorite: (ticker: string) => void
): ColumnDef<SignalData>[] => [
  {
    id: "signal.favorite",
    accessorKey: "signal.favorite",
    header: "",
    cell: ({ row }) => {
      const ticker = row.original.signal.ticker;
      const isFav = favorites.includes(ticker);
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(ticker);
          }}
          className="cursor-pointer flex justify-center items-center"
        >
          <Star
            className="h-4 w-4"
            fill={isFav ? "#facc15" : "none"}
            stroke={isFav ? "#facc15" : "currentColor"}
          />
        </button>
      );
    },
  },
  {
    accessorKey: "signal.ticker",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ticker
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // Generate image URL dynamically
      const ticker = row.original.signal.ticker.toUpperCase();
      const imageUrl = `/logos/${ticker}.png`;
      // You could add error handling with onError in the img tag

      return (
        <div className="font-medium items-center justify-start flex">
          {imageUrl && (
            <img src={imageUrl} alt="Stock Icon" className="h-6 w-6 mr-1" />
          )}
          {row.original.signal.ticker}
        </div> // 기본 왼쪽 정렬
      );
    },
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
            "w-fit",
            action.toLowerCase() === "buy" && "bg-green-500 text-white",
            action.toLowerCase() === "sell" && "bg-red-500 text-white",
            action.toLowerCase() === "hold" && "bg-yellow-500 text-white"
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
          {formatCurrency(row.original.signal.entry_price)}
        </div>
      );
    },
  },
  {
    accessorKey: "signal.close_price",
    header: "종료 가격",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatCurrency(row.original.signal.close_price)}
        </div>
      );
    },
  },
  {
    id: "take_profit_buy",
    accessorFn: (row) => {
      const { entry_price, take_profit } = row.signal;
      if (entry_price && take_profit && entry_price !== 0) {
        return ((take_profit - entry_price) / entry_price) * 100;
      }
      return null;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          익절가격 (%)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { signal } = row.original;
      const { entry_price, take_profit } = signal;
      let percentageString = "";
      if (entry_price && take_profit && entry_price !== 0) {
        const percentage = ((take_profit - entry_price) / entry_price) * 100;
        percentageString = ` (${percentage >= 0 ? "+" : ""}${percentage.toFixed(
          2
        )}%)`;
      }
      return (
        <div className="font-medium">
          {formatCurrency(take_profit)}
          {percentageString && (
            <span
              className={
                parseFloat(percentageString.replace(/[()%+]/g, "")) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {percentageString}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "stop_loss_sell",
    accessorFn: (row) => {
      const { entry_price, stop_loss } = row.signal;
      if (entry_price && stop_loss && entry_price !== 0) {
        return ((stop_loss - entry_price) / entry_price) * 100;
      }
      return null;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          손절가격 (%)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { signal } = row.original;
      const { entry_price, stop_loss } = signal;
      let percentageString = "";
      if (entry_price && stop_loss && entry_price !== 0) {
        const percentage = ((stop_loss - entry_price) / entry_price) * 100;
        percentageString = ` (${percentage >= 0 ? "+" : ""}${percentage.toFixed(
          2
        )}%)`;
      }
      return (
        <div className="font-medium">
          {formatCurrency(stop_loss)}
          {percentageString && (
            <span
              className={
                parseFloat(percentageString.replace(/[()%+]/g, "")) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {percentageString}
            </span>
          )}
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
    accessorKey: "result.signal.ai_model",
    header: "LLM 모델",
    cell: ({ row }) => {
      return (
        <Badge
          variant="default"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {row.original.signal?.ai_model ?? "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "result.is_correct",
    header: "결과",
    cell: ({ row }) => {
      const isCorrect = row.original.result?.is_correct;
      if (isCorrect == null) return <Badge variant="outline">N/A</Badge>; // Badge는 기본적으로 내용에 따라 정렬
      return isCorrect ? (
        <Badge
          variant="default"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          OK
        </Badge>
      ) : (
        <Badge variant="destructive">NO</Badge>
      );
    },
  },
  {
    accessorKey: "result.price_diff",
    header: "가격차이",
    cell: ({ row }) => {
      const priceDiff = row.original.result?.price_diff;
      return <div className="font-medium">{formatCurrency(priceDiff)}</div>;
    },
  },
];
