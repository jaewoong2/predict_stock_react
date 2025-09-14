"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTickers } from "@/hooks/useTicker";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";

type Props = {
  selected?: string[]; // multi-select
  onToggle?: (symbol: string) => void;
  onClearAll?: () => void;
  symbols?: string[]; // override symbols list
  limit?: number;
  className?: string;
  showAll?: boolean;
};

function LogoOrInitial({ symbol }: { symbol: string }) {
  const [error, setError] = useState(false);
  if (!error) {
    return (
      <Image
        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logos/${symbol.toUpperCase()}.png`}
        alt={`${symbol} logo`}
        width={20}
        height={20}
        className="h-5 w-5"
        onError={() => setError(true)}
      />
    );
  }
  return <span className="text-sm font-bold">{symbol[0]?.toUpperCase()}</span>;
}

export function TickerBadgeRow({
  selected = [],
  onToggle,
  onClearAll,
  symbols,
  limit,
  className,
}: Props) {
  const { data: allTickers, isLoading } = useTickers();

  const list = useMemo(() => {
    const base =
      symbols && symbols.length > 0
        ? symbols
        : ((allTickers ?? []).map((t) => t.symbol).filter(Boolean) as string[]);
    const uniq = Array.from(new Set(base.map((s) => s.toUpperCase()))).sort();
    return typeof limit === "number" ? uniq.slice(0, limit) : uniq;
  }, [allTickers, symbols, limit]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="no-scrollbar -mx-1 overflow-x-auto py-1">
        <div className="flex gap-2 px-1">
          {isLoading && (
            <>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200"
                />
              ))}
            </>
          )}
          <button
            type="button"
            onClick={() => onClearAll?.()}
            className={cn(
              "h-8 flex-none rounded-full border px-3 text-xs font-medium transition-colors",
              (selected?.length ?? 0) === 0
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
            )}
            aria-label="전체 티커 보기"
            aria-pressed={(selected?.length ?? 0) === 0}
          >
            전체
          </button>

          {!isLoading &&
            list.length > 0 &&
            list.map((symbol) => (
              <Tooltip key={symbol}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onToggle?.(symbol)}
                    aria-label={`${symbol} 뉴스 보기`}
                    aria-pressed={selected?.includes(symbol)}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                      selected?.includes(symbol)
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 bg-black/15 text-gray-700",
                    )}
                    title={symbol}
                  >
                    <LogoOrInitial symbol={symbol} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{symbol}</span>
                </TooltipContent>
              </Tooltip>
            ))}
        </div>
      </div>
    </div>
  );
}

export default TickerBadgeRow;
