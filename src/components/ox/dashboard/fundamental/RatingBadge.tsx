import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Rating } from "@/types/fundamental-analysis";

interface RatingBadgeProps {
  rating: Rating;
  className?: string;
}

const ratingConfig: Record<
  Rating,
  { className: string; displayText: string }
> = {
  "Strong Buy": {
    className: "bg-emerald-600 text-white dark:bg-emerald-500",
    displayText: "Strong Buy",
  },
  Buy: {
    className: "bg-emerald-500 text-white dark:bg-emerald-600",
    displayText: "Buy",
  },
  Hold: {
    className: "bg-amber-500 text-white dark:bg-amber-600",
    displayText: "Hold",
  },
  Sell: {
    className: "bg-rose-500 text-white dark:bg-rose-600",
    displayText: "Sell",
  },
  "Strong Sell": {
    className: "bg-rose-600 text-white dark:bg-rose-500",
    displayText: "Strong Sell",
  },
};

export function RatingBadge({ rating, className }: RatingBadgeProps) {
  const config = ratingConfig[rating];

  return (
    <Badge className={cn("font-semibold", config.className, className)}>
      {config.displayText}
    </Badge>
  );
}
