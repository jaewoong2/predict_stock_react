"use client";

import React, { memo } from "react";
import { Filter } from "lucide-react";
import { TossCardTitle } from "@/components/ui/toss-card";
import { cn } from "@/lib/utils";

export const FILTERS = [
  { id: "ALL" as const, label: "전체" },
  { id: "Buy" as const, label: "Buy" },
  { id: "Hold" as const, label: "Hold" },
  { id: "Sell" as const, label: "Sell" },
] as const;

const FiltersBar = memo(function FiltersBar({
  value,
  onChange,
  isFetching,
}: {
  value: "ALL" | "Buy" | "Hold" | "Sell";
  onChange: (v: "ALL" | "Buy" | "Hold" | "Sell") => void;
  isFetching: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-blue-600" />
        <TossCardTitle className="flex items-center gap-2">
          필터
          {isFetching && (
            <span className="ml-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />
          )}
        </TossCardTitle>
      </div>
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
        {FILTERS.map((filterItem) => (
          <button
            key={filterItem.id}
            onClick={() => onChange(filterItem.id)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
              value === filterItem.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800",
            )}
          >
            {filterItem.label}
          </button>
        ))}
      </div>
    </>
  );
});

export default FiltersBar;

