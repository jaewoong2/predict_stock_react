"use client";
import { Suspense } from "react";
import { PredictionForm } from "@/components/ox/predict/prediction-form";
import { PredictionHistory } from "@/components/ox/predict/prediction-history";
import { UniverseList } from "@/components/ox/predict/universe-list";
import {
  TossCard,
  TossCardContent,
  TossCardHeader,
} from "@/components/ui/toss-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, History, Target } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function PredictPage() {
  const [activeTab, setActiveTab] = useState("predict");

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        {/* Page Header with Toss style */}
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-blue-100 p-3">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">오늘의 예측</h1>
          <p className="mx-auto max-w-md text-sm text-gray-600">
            미국 주식 100개 종목에 대해 상승/하락을 예측하고 포인트를 획득하세요
          </p>
        </div>

        {/* Custom Tab Navigation */}
        <div className="flex justify-center">
          <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("predict")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200",
                activeTab === "predict"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800",
              )}
            >
              <Target className="h-4 w-4" />
              예측하기
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200",
                activeTab === "history"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800",
              )}
            >
              <History className="h-4 w-4" />
              예측 히스토리
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "predict" && (
            <>
              {/* Quick Prediction Form */}
              <Suspense fallback={<PredictionFormSkeleton />}>
                <PredictionForm />
              </Suspense>

              {/* Universe List */}
              <Suspense fallback={<UniverseListSkeleton />}>
                <UniverseList />
              </Suspense>
            </>
          )}

          {activeTab === "history" && (
            <Suspense fallback={<HistorySkeleton />}>
              <PredictionHistory />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

function PredictionFormSkeleton() {
  return (
    <TossCard padding="lg">
      <TossCardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </TossCardHeader>
      <TossCardContent>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        </div>
      </TossCardContent>
    </TossCard>
  );
}

function UniverseListSkeleton() {
  return (
    <TossCard padding="lg">
      <TossCardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </TossCardHeader>
      <TossCardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="mb-1 h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </TossCardContent>
    </TossCard>
  );
}

function HistorySkeleton() {
  return (
    <TossCard padding="lg">
      <TossCardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </TossCardHeader>
      <TossCardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div>
                  <Skeleton className="mb-1 h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </TossCardContent>
    </TossCard>
  );
}
