"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Clock, Newspaper } from "lucide-react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MarketNewsItem } from "@/types/news";

function RecBadge({ rec }: { rec: "Buy" | "Hold" | "Sell" | null }) {
  const variant =
    rec === "Buy"
      ? "bg-green-100 text-green-700 border-green-200"
      : rec === "Sell"
        ? "bg-red-100 text-red-700 border-red-200"
        : rec === "Hold"
          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
          : "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={cn("px-2 py-1 rounded-lg text-xs font-medium border", variant)}>
      {rec ?? "N/A"}
    </span>
  );
}

export interface NewsDetailSheetProps {
  item: MarketNewsItem | null;
  onOpenChange: (open: boolean) => void;
}

export function NewsDetailSheet({ item, onOpenChange }: NewsDetailSheetProps) {
  const open = !!item;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <div className="mx-auto mb-2 flex justify-center">
            <div className="rounded-2xl bg-orange-100 p-2">
              <Newspaper className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <DrawerTitle className="text-center text-base font-bold leading-snug text-gray-900">
            {item?.headline ?? "뉴스"}
          </DrawerTitle>
          <div className="mt-2 flex items-center justify-center gap-2">
            {item?.ticker ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                {item.ticker[0]?.toUpperCase()}
              </div>
            ) : null}
            <RecBadge rec={item?.recommendation ?? null} />
          </div>
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{item ? format(new Date(item.created_at), "yyyy.MM.dd HH:mm", { locale: ko }) : ""}</span>
          </div>
        </DrawerHeader>

        {item ? (
          <div className="space-y-4 px-4 pb-2">
            {item.summary ? (
              <p className="text-sm leading-relaxed text-gray-700">{item.summary}</p>
            ) : null}
            {item.detail_description ? (
              <div className="rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
                <p className="whitespace-pre-wrap">{item.detail_description}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <DrawerFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

