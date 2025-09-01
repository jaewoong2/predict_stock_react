"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePredictionStats } from "@/hooks/usePrediction";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function DashboardCharts() {
  const { data: predictionStats } = usePredictionStats();

  // 예측 정확도 데이터
  const accuracyData = [
    {
      name: "정답",
      value: predictionStats?.correct_predictions || 0,
      color: "#10b981",
    },
    {
      name: "오답",
      value: predictionStats?.incorrect_predictions || 0,
      color: "#ef4444",
    },
    {
      name: "무효",
      value: predictionStats?.void_predictions || 0,
      color: "#f59e0b",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>예측 정확도</CardTitle>
        <CardDescription>전체 예측 결과 분포</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={accuracyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {accuracyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 범례 */}
        <div className="mt-4 flex justify-center space-x-4">
          {accuracyData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground text-sm">
                {item.name}: {item.value}개
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
