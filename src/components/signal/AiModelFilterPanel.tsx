"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiModelFilterPanelProps {
  availableModels: string[];
  selectedModels: string[];
  conditions: ("OR" | "AND")[];
  onModelsChange: (models: string[]) => void;
  onConditionChange: (index: number, value: "OR" | "AND") => void;
}

export const AiModelFilterPanel = React.memo(
  ({
    availableModels,
    selectedModels,
    conditions = ["AND", "OR"],
    onModelsChange,
    onConditionChange,
  }: AiModelFilterPanelProps) => {
    const handleModelToggle = (model: string) => {
      const currentIndex = selectedModels.indexOf(model);
      const newSelectedModels = [...selectedModels];

      if (currentIndex === -1) {
        newSelectedModels.push(model);
      } else {
        newSelectedModels.splice(currentIndex, 1);
      }
      onModelsChange(newSelectedModels);
    };

    const handleConditionToggle = (index: number) => {
      console.log(conditions);
      const current = conditions[index] ?? "OR";
      onConditionChange(index, current === "OR" ? "AND" : "OR");
    };

    return (
      <>
        <div className="flex flex-wrap items-center">
          <div className="flex items-center gap-2">
            {selectedModels.map((model, index) => (
              <React.Fragment key={model}>
                <Badge
                  variant="secondary"
                  className={cn(
                    "flex cursor-pointer items-center gap-1",
                    "text-primary-foreground bg-blue-500",
                  )}
                  onClick={() => handleModelToggle(model)}
                >
                  {model}
                </Badge>
                {index + 1 < selectedModels.length && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleConditionToggle(index)}
                    className="text-muted-foreground hover:text-foreground m-0 cursor-pointer p-0 px-2 text-xs"
                  >
                    {conditions[index] ?? "OR"}
                  </Button>
                )}
              </React.Fragment>
            ))}
            {availableModels
              .filter((m) => !selectedModels.includes(m))
              .map((model) => (
                <Badge
                  key={model}
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground flex cursor-pointer items-center gap-1"
                  onClick={() => handleModelToggle(model)}
                >
                  {model}
                </Badge>
              ))}
          </div>
        </div>
      </>
    );
  },
);

AiModelFilterPanel.displayName = "AiModelFilterPanel";
