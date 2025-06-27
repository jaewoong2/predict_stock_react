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

export function AiModelFilterPanel({
  availableModels,
  selectedModels,
  conditions,
  onModelsChange,
  onConditionChange,
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

  const handleConditionToggle = (index: number) => {
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
                  "flex items-center gap-1 cursor-pointer",
                  "bg-blue-500 text-primary-foreground"
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
                  className="text-xs text-muted-foreground hover:text-foreground m-0 p-0 px-2 cursor-pointer"
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
                className="flex items-center gap-1 cursor-pointer bg-secondary text-secondary-foreground"
                onClick={() => handleModelToggle(model)}
              >
                {model}
              </Badge>
            ))}
        </div>
      </div>
    </>
  );
}
