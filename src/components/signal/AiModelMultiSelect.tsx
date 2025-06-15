import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface AiModelMultiSelectProps {
  options: string[];
  value: string[];
  onChange: (models: string[]) => void;
}

export function AiModelMultiSelect({
  options,
  value,
  onChange,
}: AiModelMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = (model: string) => {
    if (value.includes(model)) {
      onChange(value.filter((m) => m !== model));
    } else {
      onChange([...value, model]);
    }
  };

  const filtered = options.filter((m) =>
    m.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value.length > 0 ? `${value.length}개 선택됨` : "모델 선택"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="모델 검색..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>해당 모델이 없습니다.</CommandEmpty>
            <CommandGroup>
              {filtered.map((model) => (
                <CommandItem
                  key={model}
                  onSelect={() => toggle(model)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(model) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {model}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
