import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Recommendation = "Buy" | "Sell" | "Hold";

interface RecommendationBadgeProps {
  recommendation: Recommendation;
  variant?: "default" | "selected" | "drawer";
}

const recommendationConfig = {
  Buy: {
    default: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    selected: "bg-emerald-600 text-white dark:bg-emerald-500",
    drawer: "bg-emerald-500 text-white",
  },
  Sell: {
    default: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    selected: "bg-rose-600 text-white dark:bg-rose-500",
    drawer: "bg-rose-500 text-white",
  },
  Hold: {
    default: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    selected: "bg-amber-600 text-white dark:bg-amber-500",
    drawer: "bg-amber-500 text-white",
  },
};

export function RecommendationBadge({
  recommendation,
  variant = "default",
}: RecommendationBadgeProps) {
  const colorClass = recommendationConfig[recommendation][variant];

  return (
    <Badge className={cn("shrink-0", colorClass)}>{recommendation}</Badge>
  );
}
