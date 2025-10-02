import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ForecastBadgeProps {
  type: "expert" | "community";
  outlook: "UP" | "DOWN";
  percentage: number;
  variant?: "compact" | "full";
  onClick?: () => void;
}

const typeConfig = {
  expert: {
    label: "전문가",
    upColor: "text-emerald-600 dark:text-emerald-400",
    downColor: "text-rose-600 dark:text-rose-400",
  },
  community: {
    label: "커뮤니티",
    upColor: "text-blue-600 dark:text-blue-400",
    downColor: "text-orange-600 dark:text-orange-400",
  },
};

export function ForecastBadge({
  type,
  outlook,
  percentage,
  variant = "compact",
  onClick,
}: ForecastBadgeProps) {
  const config = typeConfig[type];
  const isUp = outlook === "UP";
  const Icon = isUp ? TrendingUp : TrendingDown;
  const colorClass = isUp ? config.upColor : config.downColor;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-[#11131a]">
        <Icon className={cn("h-3.5 w-3.5", colorClass)} />
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {config.label}
        </span>
        <span className={cn("text-sm font-bold", colorClass)}>
          {percentage}%
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-[#11131a] dark:hover:border-slate-700"
    >
      <Icon className={cn("h-4 w-4", colorClass)} />
      <div className="flex flex-1 flex-col">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {config.label}
        </span>
        <span className={cn("text-lg font-bold", colorClass)}>
          {isUp ? "상승" : "하락"} {percentage}%
        </span>
      </div>
    </button>
  );
}
