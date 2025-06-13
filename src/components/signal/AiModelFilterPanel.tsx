import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiModelFilterPanelProps {
  availableModels: string[];
  selectedModels: string[];
  onModelsChange: (models: string[]) => void;
  onConditionChange: (value: "OR" | "AND") => void;
  condition: "OR" | "AND";
}

export function AiModelFilterPanel({
  availableModels,
  selectedModels,
  onModelsChange,
  onConditionChange,
  condition,
}: AiModelFilterPanelProps) {
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

  return (
    <>
      <div className="flex flex-wrap items-center">
        <div className="flex items-center gap-2">
          {availableModels.map((model, index) => (
            <React.Fragment key={model}>
              <Badge
                key={model}
                variant="secondary"
                className={cn(
                  "flex items-center gap-1 cursor-pointer",
                  selectedModels.includes(model)
                    ? "bg-blue-500 text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
                onClick={() => handleModelToggle(model)}
              >
                {model}
              </Badge>
              {index + 1 < availableModels.length && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() =>
                    onConditionChange(condition === "OR" ? "AND" : "OR")
                  }
                  className="text-xs text-muted-foreground hover:text-foreground m-0 p-0 px-2 cursor-pointer"
                >
                  {condition}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
