"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SignalData } from "../../types/signal";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button"; // Shadcn UI의 Button 임포트 경로 확인 필요
import { Badge } from "@/components/ui/badge"; // Shadcn UI의 Badge 임포트 경로 확인 필요

// Helper function to format date string
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (err) {
    console.error("Invalid date format:", dateString, err);
    return dateString; // Invalid date format
  }
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
      <div className="font-medium">{row.original.signal.ticker}</div>
    ),
  },
  {
    accessorKey: "signal.strategy",
    header: "전략",
  },
  {
    accessorKey: "signal.action",
    header: "액션",
    cell: ({ row }) => {
      const action = row.original.signal.action;
      return (
        <Badge
          variant={
            action === "buy"
              ? "default"
              : action === "sell"
              ? "destructive"
              : "secondary"
          }
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
      const amount = parseFloat(String(row.original.signal.entry_price));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD", // 통화는 실제 데이터에 맞게 조정
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "signal.probability",
    header: "확률",
    cell: ({ row }) => {
      const probability = row.original.signal.probability;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "secondary";
      if (probability === "High") variant = "default";
      if (probability === "Low") variant = "destructive";
      return <Badge variant={variant}>{probability}</Badge>;
    },
  },
  {
    accessorKey: "result.is_correct",
    header: "결과 (정확도)",
    cell: ({ row }) => {
      const isCorrect = row.original.result?.is_correct;
      return isCorrect ? (
        <Badge variant="default" className="bg-green-500 text-white">
          성공
        </Badge>
      ) : (
        <Badge variant="destructive">실패</Badge>
      );
    },
  },
  {
    accessorKey: "signal.timestamp",
    header: "시그널 시간",
    cell: ({ row }) => formatDate(row.original.signal.timestamp),
  },
  // 상세 보기 버튼 또는 행 전체 클릭을 위한 액션 컬럼 (선택 사항)
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     // const signal = row.original;
  //     // 여기에 상세 보기 버튼 등을 추가할 수 있습니다.
  //     // 예: <Button variant="ghost" size="sm"><Info className="h-4 w-4" /></Button>
  //     return null;
  //   },
  // },
];
