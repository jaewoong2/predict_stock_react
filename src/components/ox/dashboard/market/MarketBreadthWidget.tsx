"use client";

import { useMarketBreadth } from "@/hooks/useMarketData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MarketBreadthWidgetProps {
  targetDate?: string;
}

export function MarketBreadthWidget({ targetDate }: MarketBreadthWidgetProps) {
  const { data, isLoading, error } = useMarketBreadth({
    target_date: targetDate,
  });

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  if (!data || data.series.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50 p-12 text-center dark:bg-[#11131a]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          시장 폭 데이터가 없습니다.
        </p>
      </div>
    );
  }

  // Prepare data for charts
  const vixData = data.series.map((item) => ({
    date: item.date,
    vix: item.vix,
  }));

  const breadthData = data.series.map((item) => ({
    date: item.date,
    advancers: item.advancers,
    decliners: item.decliners,
    new_highs: item.new_highs,
    new_lows: item.new_lows,
  }));

  return (
    <div className="space-y-6">
      {/* VIX Chart */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          VIX 변동성 지수
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vixData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                stroke="#94a3b8"
                style={{ fontSize: "11px" }}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: "11px" }}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="vix"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="VIX"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advancers vs Decliners */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          상승/하락 종목 수
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breadthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                stroke="#94a3b8"
                style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="advancers" fill="#10b981" name="상승" />
              <Bar dataKey="decliners" fill="#ef4444" name="하락" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Highs vs Lows */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          신고가/신저가 종목 수
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breadthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                stroke="#94a3b8"
                style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="new_highs" fill="#3b82f6" name="신고가" />
              <Bar dataKey="new_lows" fill="#f97316" name="신저가" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Commentary */}
      {data.commentary && (
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-[#11131a]">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {data.commentary}
          </p>
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
