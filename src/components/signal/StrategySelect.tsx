"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STRATEGY_OPTIONS } from "@/types/signal";
import { HelpCircle } from "lucide-react";

interface StrategySelectProps {
  value?: string | null;
  onChange: (strategy: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function StrategySelect({
  value,
  onChange,
  placeholder = "전략 선택",
  className,
}: StrategySelectProps) {
  const selectedStrategy = STRATEGY_OPTIONS.find(
    (option) => option.value === value,
  );

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value || "all"}
        onValueChange={(newValue) =>
          onChange(newValue === "all" ? null : newValue)
        }
      >
        <SelectTrigger className={`w-[200px] ${className}`}>
          <SelectValue placeholder={placeholder}>
            {selectedStrategy?.label || "전체 전략"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 전략</SelectItem>
          {STRATEGY_OPTIONS.map((strategy) => (
            <SelectItem key={strategy.value} value={strategy.value}>
              <div className="flex items-center gap-2">
                <span>{strategy.label}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="text-muted-foreground h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent
                    className="max-w-sm text-sm whitespace-pre-wrap"
                    side="right"
                  >
                    {strategy.description}
                  </TooltipContent>
                </Tooltip>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
