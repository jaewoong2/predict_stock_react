"use client";

import React from "react";
import { useMahaneyAnalysis } from "@/hooks/useMahaneyAnalysis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MahaneyAnalysisCardProps {
  symbol: string;
  date: string;
}

const getRecommendationVariant = (
  recommendation: string,
): "success" | "destructive" | "warning" | "secondary" => {
  switch (recommendation.toLowerCase()) {
    case "buy":
      return "success";
    case "sell":
      return "destructive";
    case "hold":
      return "warning";
    default:
      return "secondary";
  }
};

export const MahaneyAnalysisCard: React.FC<MahaneyAnalysisCardProps> = ({
  symbol,
  date,
}) => {
  const { data, isLoading, error } = useMahaneyAnalysis({
    target_date: date,
    tickers: [symbol],
    limit: 1,
  });

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>
              마하니 분석 데이터를 불러오는 중 오류가 발생했습니다.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const analysis = data?.stocks[0];

  if (!analysis) {
    return (
      <Card className="shadow-none">
        <CardContent className="text-muted-foreground p-6 text-center">
          {symbol}에 대한 마하니 분석 데이터가 없습니다.
        </CardContent>
      </Card>
    );
  }

  const criteria = [
    { name: "매출 성장", data: analysis.revenue_growth },
    { name: "밸류에이션", data: analysis.valuation },
    { name: "제품 혁신", data: analysis.product_innovation },
    { name: "시장 규모", data: analysis.tam },
    { name: "고객 가치", data: analysis.customer_value },
    { name: "경영진 품질", data: analysis.management_quality },
    { name: "타이밍", data: analysis.timing },
  ];

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-xl">{analysis.stock_name}</CardTitle>
            <CardDescription className="mt-1">
              7단계 체크리스트 기반 기술주 분석 (Mark Mahaney)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={getRecommendationVariant(analysis.recommendation)}
              className="text-sm"
            >
              {analysis.recommendation}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <span className="text-foreground text-sm font-bold">
            {analysis.recommendation_score}
          </span>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">종합 평가</h4>
          <p className="text-muted-foreground text-sm">
            {analysis.final_assessment}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">체크리스트 평가</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {criteria.map((criterion, index) => (
              <div
                key={index}
                className="bg-muted/50 space-y-2 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{criterion.name}</span>
                  {criterion.data.pass_criterion ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>
                    <strong>지표:</strong> {criterion.data.metric}
                  </p>
                  <p>{criterion.data.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <h4 className="font-semibold">상세 분석</h4>
          <p className="text-muted-foreground text-sm">
            {analysis.detail_summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
