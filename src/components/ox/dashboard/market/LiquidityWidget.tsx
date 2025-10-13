"use client";

import { useLiquidity } from "@/hooks/useMarketData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LiquidityWidgetProps {
  targetDate?: string;
}

export function LiquidityWidget({ targetDate }: LiquidityWidgetProps) {
  const { data, isLoading, error } = useLiquidity({ target_date: targetDate });

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  if (!data || (data.series_m2.length === 0 && data.series_rrp.length === 0)) {
    return (
      <div className="rounded-2xl bg-slate-50 p-12 text-center dark:bg-[#11131a]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          유동성 데이터가 없습니다.
        </p>
      </div>
    );
  }

  // Merge M2 and RRP data by date
  const chartData = data.series_m2.map((m2Item) => {
    const rrpItem = data.series_rrp.find((r) => r.date === m2Item.date);
    return {
      date: m2Item.date,
      m2: m2Item.m2,
      rrp: rrpItem?.rrp || null,
    };
  });

  return (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              stroke="#94a3b8"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              yAxisId="left"
              stroke="#3b82f6"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `$${value.toFixed(0)}T`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#ef4444"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `$${value.toFixed(0)}B`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value: number, name: string) => {
                if (value === undefined || typeof value !== "number")
                  return ["N/A", name];
                return [
                  name === "m2"
                    ? `$${value.toFixed(1)}T`
                    : `$${value.toFixed(1)}B`,
                  name === "m2" ? "M2 통화량" : "역레포 잔액",
                ];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) =>
                value === "m2" ? "M2 통화량" : "역레포 잔액"
              }
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="m2"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="m2"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rrp"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="rrp"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Commentary */}
      {data.commentary && (
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-[#11131a]">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {data.commentary}
          </p>
          {data.window && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              기간: {data.window}
            </p>
          )}
        </div>
      )}

      {/* Sources */}
      {data.sources && data.sources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              {source.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
