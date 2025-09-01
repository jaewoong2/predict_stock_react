import { Suspense } from "react";
import { PredictionForm } from "@/components/ox/predict/prediction-form";
import { PredictionHistory } from "@/components/ox/predict/prediction-history";
import { UniverseList } from "@/components/ox/predict/universe-list";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PredictPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">예측하기</h1>
        <p className="text-muted-foreground">
          오늘의 종목에 대해 O/X 예측을 해보세요.
        </p>
      </div>

      <Tabs defaultValue="predict" className="space-y-6">
        <TabsList>
          <TabsTrigger value="predict">예측하기</TabsTrigger>
          <TabsTrigger value="history">예측 히스토리</TabsTrigger>
        </TabsList>

        <TabsContent value="predict" className="space-y-6">
          {/* Prediction Form */}
          <Suspense fallback={<PredictionFormSkeleton />}>
            <PredictionForm />
          </Suspense>

          {/* Universe List */}
          <Suspense fallback={<UniverseListSkeleton />}>
            <UniverseList />
          </Suspense>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Suspense fallback={<HistorySkeleton />}>
            <PredictionHistory />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PredictionFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UniverseListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div>
                  <Skeleton className="mb-1 h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function HistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div>
                  <Skeleton className="mb-1 h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
