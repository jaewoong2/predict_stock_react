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
import { Alert } from "@/components/ui/alert";

interface MahaneyAnalysisCardProps {
  symbol: string;
  date: string;
}

const getRecommendationColor = (recommendation: string) => {
  switch (recommendation) {
    case "Buy":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Sell":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Hold":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getCriterionIcon = (pass: boolean) => {
  return pass ? "✅" : "❌";
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
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <p>마하니 분석 데이터를 불러올 수 없습니다.</p>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const analysis = data?.stocks[0];

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            {symbol}에 대한 마하니 분석 데이터가 없습니다.
          </p>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{analysis.stock_name}</CardTitle>
            <CardDescription className="mt-2">
              7단계 체크리스트 기반 기술주 분석 (Mark Mahaney)
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getRecommendationColor(analysis.recommendation)}>
              {analysis.recommendation}
            </Badge>
            <span className="text-sm font-medium">
              {analysis.recommendation_score}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 shadow-none">
        <div>
          <h4 className="mb-2 font-medium">종합 평가</h4>
          <p className="text-muted-foreground mb-2 text-sm">
            {analysis.final_assessment}
          </p>
          <p className="text-sm">{analysis.summary}</p>
        </div>

        <div>
          <h4 className="mb-4 font-medium">체크리스트 평가</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {criteria.map((criterion, index) => (
              <div
                key={index}
                className="bg-muted/50 space-y-2 rounded-lg border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{criterion.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getCriterionIcon(criterion.data.pass_criterion)}
                    </span>
                    {/* <span className="text-sm font-medium">
                      {criterion.data.score}/10
                    </span> */}
                  </div>
                </div>
                {/* <Progress value={criterion.data.score * 10} className="h-2" /> */}
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p>
                    <strong>지표:</strong> {criterion.data.metric}
                  </p>
                  <p>{criterion.data.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="mb-2 font-medium">상세 분석</h4>
          <p className="text-muted-foreground text-sm">
            {analysis.detail_summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
