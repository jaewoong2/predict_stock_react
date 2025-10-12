"use client";

import { useState } from "react";
import { ArrowRight, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FundamentalAnalysisGetResponse } from "@/types/fundamental-analysis";
import { RatingBadge } from "./RatingBadge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface FundamentalAnalysisCardProps {
  data: FundamentalAnalysisGetResponse;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function FundamentalAnalysisCard({
  data,
  onRefresh,
  isRefreshing = false,
}: FundamentalAnalysisCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { analysis, is_cached, days_until_expiry } = data;
  const { recommendation } = analysis;

  const upside = recommendation.upside_downside || 0;
  const isPositive = upside >= 0;

  return (
    <>
      <Card className="group cursor-pointer overflow-hidden rounded-2xl border-slate-200 bg-white shadow-none transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-[#11131a] dark:hover:border-slate-700">
        <CardContent className="p-6" onClick={() => setIsDrawerOpen(true)}>
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {analysis.ticker}
                </h3>
                <RatingBadge rating={recommendation.rating} />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {analysis.company_name}
              </p>
              {analysis.industry && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  {analysis.industry}
                </p>
              )}
            </div>
            {is_cached && (
              <Badge
                variant="outline"
                className="shrink-0 border-slate-300 text-xs dark:border-slate-700"
              >
                캐시 {days_until_expiry}일
              </Badge>
            )}
          </div>

          {/* Price & Target */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-[#151b24]">
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                현재가
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                ${recommendation.current_price?.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-[#151b24]">
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                목표가
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${recommendation.target_price?.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-[#151b24]">
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                상승여력
              </p>
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-rose-600" />
                )}
                <p
                  className={cn(
                    "text-lg font-bold",
                    isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {upside.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <p className="mb-3 line-clamp-2 text-sm text-slate-700 dark:text-slate-300">
            {analysis.executive_summary}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {new Date(analysis.analysis_date).toLocaleDateString("ko-KR")}
            </span>
            <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 dark:text-slate-500" />
          </div>
        </CardContent>
      </Card>

      {/* Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="mx-auto h-full max-h-[85vh] w-fit pb-10 !select-text max-sm:max-h-[75vh] max-sm:w-[calc(100%-14px)]">
          <div className="mx-auto h-full w-full max-w-5xl overflow-y-scroll px-6 max-sm:px-4">
            <DrawerHeader>
              <DrawerClose asChild>
                <button className="absolute -top-10 -right-0 cursor-pointer text-3xl text-white">
                  &times;
                </button>
              </DrawerClose>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DrawerTitle className="text-left text-2xl">
                    {analysis.ticker} - {analysis.company_name}
                  </DrawerTitle>
                  <DrawerDescription className="text-left">
                    {analysis.industry && (
                      <span className="mr-2">{analysis.industry}</span>
                    )}
                    <span className="text-slate-500">
                      {new Date(analysis.analysis_date).toLocaleDateString(
                        "ko-KR"
                      )}
                    </span>
                  </DrawerDescription>
                </div>
                <div className="flex items-center gap-2">
                  {is_cached && (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-slate-300 dark:border-slate-700"
                    >
                      캐시 {days_until_expiry}일
                    </Badge>
                  )}
                  {onRefresh && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRefresh();
                      }}
                      disabled={isRefreshing}
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <RefreshCw
                        className={cn("h-4 w-4", isRefreshing && "animate-spin")}
                      />
                      새로고침
                    </Button>
                  )}
                </div>
              </div>
            </DrawerHeader>

            <div className="space-y-6 p-4">
              {/* Investment Recommendation */}
              <div className="rounded-xl bg-slate-50 p-6 dark:bg-[#151b24]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    투자 추천
                  </h3>
                  <RatingBadge rating={recommendation.rating} />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-slate-500">현재가</p>
                    <p className="text-2xl font-bold">
                      ${recommendation.current_price?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">목표가</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${recommendation.target_price?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">상승 여력</p>
                    <p
                      className={cn(
                        "text-2xl font-bold",
                        isPositive ? "text-emerald-600" : "text-rose-600"
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {upside.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
                      투자 논리
                    </h4>
                    <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
                      {analysis.investment_thesis}
                    </p>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="rounded-xl bg-slate-50 p-6 dark:bg-[#151b24]">
                <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  요약
                </h3>
                <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
                  {analysis.executive_summary}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="rounded-xl bg-blue-50 p-6 dark:bg-blue-950/20">
                <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-400">
                  핵심 포인트
                </h3>
                <ul className="space-y-2">
                  {analysis.key_takeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-600 dark:text-blue-400">
                        ✓
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {takeaway}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bullish vs Bearish */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-emerald-50 p-6 dark:bg-emerald-950/20">
                  <h3 className="mb-4 text-lg font-semibold text-emerald-900 dark:text-emerald-400">
                    긍정적 요인
                  </h3>
                  <ul className="space-y-2">
                    {recommendation.key_bullish_factors.map((factor, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-emerald-800 dark:text-emerald-300"
                      >
                        • {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-rose-50 p-6 dark:bg-rose-950/20">
                  <h3 className="mb-4 text-lg font-semibold text-rose-900 dark:text-rose-400">
                    부정적 요인
                  </h3>
                  <ul className="space-y-2">
                    {recommendation.key_bearish_factors.map((factor, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-rose-800 dark:text-rose-300"
                      >
                        • {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Scenarios */}
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-6 dark:bg-[#151b24]">
                  <h4 className="mb-2 font-semibold text-slate-900 dark:text-slate-50">
                    베이스 케이스
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {recommendation.base_case_scenario}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-emerald-50 p-6 dark:bg-emerald-950/20">
                    <h4 className="mb-2 font-semibold text-emerald-900 dark:text-emerald-400">
                      불 케이스
                    </h4>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300">
                      {recommendation.bull_case_scenario}
                    </p>
                  </div>
                  <div className="rounded-xl bg-rose-50 p-6 dark:bg-rose-950/20">
                    <h4 className="mb-2 font-semibold text-rose-900 dark:text-rose-400">
                      베어 케이스
                    </h4>
                    <p className="text-sm text-rose-800 dark:text-rose-300">
                      {recommendation.bear_case_scenario}
                    </p>
                  </div>
                </div>
              </div>

              {/* Catalysts */}
              {analysis.catalyst_analysis && (
                <div className="rounded-xl bg-slate-50 p-6 dark:bg-[#151b24]">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
                    주요 촉매제
                  </h3>
                  <div className="space-y-4">
                    {analysis.catalyst_analysis.near_term_catalysts.length >
                      0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-400">
                          단기
                        </h4>
                        <ul className="space-y-1">
                          {analysis.catalyst_analysis.near_term_catalysts.map(
                            (catalyst, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-slate-600 dark:text-slate-400"
                              >
                                • {catalyst}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    {analysis.catalyst_analysis.medium_term_catalysts.length >
                      0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-400">
                          중기
                        </h4>
                        <ul className="space-y-1">
                          {analysis.catalyst_analysis.medium_term_catalysts.map(
                            (catalyst, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-slate-600 dark:text-slate-400"
                              >
                                • {catalyst}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    {analysis.catalyst_analysis.long_term_catalysts.length >
                      0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-400">
                          장기
                        </h4>
                        <ul className="space-y-1">
                          {analysis.catalyst_analysis.long_term_catalysts.map(
                            (catalyst, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-slate-600 dark:text-slate-400"
                              >
                                • {catalyst}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
