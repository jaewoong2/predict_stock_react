import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X as XIcon } from "lucide-react";
import { AiModelMultiSelect } from "./AiModelMultiSelect";

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
  const handleRemove = (model: string) => {
    onModelsChange(selectedModels.filter((m) => m !== model));
  };

  return (
    <>
      {availableModels.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg shadow bg-card">
          <h3 className="text-lg font-semibold mb-2">AI 모델 필터</h3>
          <div className="mb-3 flex items-center space-x-2">
            <AiModelMultiSelect
              options={availableModels}
              value={selectedModels}
              onChange={onModelsChange}
            />
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {selectedModels.map((model) => (
              <Badge
                key={model}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {model}
                <button
                  onClick={() => handleRemove(model)}
                  className="rounded-full hover:bg-destructive/20 p-0.5"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <RadioGroup
            value={condition}
            onValueChange={onConditionChange}
            className="flex items-center space-x-4 mb-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OR" id="ai-filter-or" />
              <Label htmlFor="ai-filter-or">OR (하나라도 일치)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AND" id="ai-filter-and" />
              <Label htmlFor="ai-filter-and">AND (모두 일치)</Label>
            </div>
          </RadioGroup>

          {selectedModels.length > 0 && (
            <div className="mt-3 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const modelsToAdd = availableModels.filter(
                    (m) => !selectedModels.includes(m)
                  );
                  onModelsChange([...selectedModels, ...modelsToAdd]);
                }}
                disabled={
                  selectedModels.length === availableModels.length ||
                  availableModels.length === 0
                }
              >
                모두 추가
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onModelsChange([])}
                disabled={selectedModels.length === 0}
              >
                모두 해제
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
