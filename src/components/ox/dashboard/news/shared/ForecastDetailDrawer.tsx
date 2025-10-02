import { TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MarketForecastResponse } from "@/types/news";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface ForecastDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forecast: {
    date: string;
    major?: MarketForecastResponse | null;
    minor?: MarketForecastResponse | null;
  } | null;
}

interface ForecastSectionProps {
  title: string;
  titleColor: string;
  outlook?: "UP" | "DOWN";
  percentage?: number;
  reason?: string;
  iconBgColor: string;
}

function ForecastSection({
  title,
  titleColor,
  outlook,
  percentage,
  reason,
  iconBgColor,
}: ForecastSectionProps) {
  const isUp = outlook === "UP";
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-xl bg-slate-50 p-6 dark:bg-[#151b24]">
      <div className="mb-4 flex items-center gap-2">
        <h3 className={cn("text-lg font-semibold", titleColor)}>{title}</h3>
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full",
            iconBgColor,
          )}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="mb-4">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          예측:{" "}
        </span>
        <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
          {isUp ? "상승" : "하락"} {percentage}%
        </span>
      </div>
      <h4 className="mb-2 font-medium text-slate-900 dark:text-slate-50">
        근거
      </h4>
      <p className="whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
        {reason || "특별한 이유가 제공되지 않았습니다."}
      </p>
    </div>
  );
}

export function ForecastDetailDrawer({
  open,
  onOpenChange,
  forecast,
}: ForecastDetailDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto h-full max-h-[80vh] w-fit pb-10 !select-text max-sm:max-h-[70vh] max-sm:w-[calc(100%-14px)]">
        <div className="mx-auto h-full w-full max-w-4xl overflow-y-scroll px-6 max-sm:px-4">
          <DrawerHeader>
            <DrawerClose asChild>
              <button className="absolute -top-10 -right-0 cursor-pointer text-3xl text-white">
                &times;
              </button>
            </DrawerClose>
            <DrawerTitle>시장 예측 세부정보</DrawerTitle>
            <DrawerDescription>
              {forecast?.date
                ? format(new Date(forecast.date), "yyyy년 MM월 dd일")
                : ""}
            </DrawerDescription>
          </DrawerHeader>
          <div className="z-10 space-y-6 p-4 pb-0">
            {/* Expert Forecast */}
            {forecast?.major && (
              <ForecastSection
                title="전문가 시장 예측"
                titleColor="text-emerald-600 dark:text-emerald-400"
                outlook={forecast.major.outlook}
                percentage={forecast.major.up_percentage}
                reason={forecast.major.reason}
                iconBgColor={
                  forecast.major.outlook === "UP"
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                }
              />
            )}

            {/* Community Forecast */}
            {forecast?.minor && (
              <ForecastSection
                title="커뮤니티 시장 예측"
                titleColor="text-blue-600 dark:text-blue-400"
                outlook={forecast.minor.outlook}
                percentage={forecast.minor.up_percentage}
                reason={forecast.minor.reason}
                iconBgColor={
                  forecast.minor.outlook === "UP"
                    ? "bg-blue-500"
                    : "bg-orange-500"
                }
              />
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
