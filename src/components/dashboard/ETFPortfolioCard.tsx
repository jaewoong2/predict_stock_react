"use client";

import React from "react";
import { useETFPortfolio } from "@/hooks/useETFPortfolio";
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
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  DollarSign,
} from "lucide-react";

interface ETFPortfolioCardProps {
  etfTickers?: string[];
  targetDate?: string;
  limit?: number;
}

const getActionVariant = (
  action: "BUY" | "SELL",
): "success" | "destructive" => {
  return action === "BUY" ? "success" : "destructive";
};

const getActionIcon = (action: string) => {
  return action === "BUY" ? (
    <TrendingUp className="h-4 w-4 text-green-500" />
  ) : (
    <TrendingDown className="h-4 w-4 text-red-500" />
  );
};

export const ETFPortfolioCard: React.FC<ETFPortfolioCardProps> = ({
  etfTickers = [],
  targetDate,
  limit = 10,
}) => {
  const { data, isLoading, error } = useETFPortfolio({
    etf_tickers: etfTickers,
    target_date: targetDate,
    limit,
    sort_by: "total_value",
    sort_order: "desc",
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
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
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
              ETF 포트폴리오 데이터를 불러오는 중 오류가 발생했습니다.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const portfolios = data?.etf_analyses || [];

  if (portfolios.length === 0) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-medium">ETF 포트폴리오 변동</CardTitle>
          <CardDescription>
            ETF 포트폴리오의 주요 변동 사항을 분석합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground p-6 text-center">
          선택한 ETF에 대한 포트폴리오 데이터가 없습니다.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-medium">ETF 포트폴리오 변동</CardTitle>
            <CardDescription className="mt-1">
              ETF 포트폴리오의 주요 변동 사항을 분석합니다
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-normal">
            {targetDate || "최신"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {portfolios.map((portfolio, index) => (
          <div key={portfolio.etf_ticker} className="space-y-4">
            {index > 0 && <Separator className="my-6" />}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {portfolio.etf_name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {portfolio.etf_ticker}
                  </p>
                </div>
                {portfolio.total_value && (
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-lg font-semibold">
                        ${(portfolio.total_value / 1000000000).toFixed(2)}B
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">총 운용자산</p>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground text-sm">
                {portfolio.summary}
              </p>

              {portfolio.changes && portfolio.changes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">주요 포트폴리오 변동</h4>
                  <div className="space-y-2">
                    {portfolio.changes.map((change, changeIndex) => (
                      <div
                        key={changeIndex}
                        className="bg-muted/30 flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {change.ticker}
                              </span>
                              <Badge
                                variant={getActionVariant(change.action)}
                                className="h-5 px-2 text-xs"
                              >
                                {change.action}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {change.reason}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {change.total_value && (
                            <div className="text-sm font-medium">
                              $
                              {Math.abs(change.total_value / 1000000).toFixed(
                                1,
                              )}
                              M
                            </div>
                          )}
                          {change.percentage_of_portfolio && (
                            <div className="text-muted-foreground text-xs">
                              {change.percentage_of_portfolio > 0 ? "+" : ""}
                              {change.percentage_of_portfolio.toFixed(2)}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-muted/20 space-y-2 rounded-lg p-3">
                <h4 className="flex items-center gap-1.5 text-sm font-medium">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  시장 영향 분석
                </h4>
                <p className="text-muted-foreground text-sm">
                  {portfolio.market_impact}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
