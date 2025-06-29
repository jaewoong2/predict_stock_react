"use client";
import { useState, useMemo } from "react"; // useMemo 추가
import { Search, Check } from "lucide-react"; // Check 아이콘 추가
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // cn 유틸리티 추가
import { Button } from "../ui/button";

type Props = {
  selectedTickers: string[]; // 선택된 티커 배열
  onSelectedTickersChange: (tickers: string[]) => void; // 티커 변경 시 호출될 함수
  availableTickers?: string[]; // 드롭다운에 표시될 전체 티커 목록
  placeholder?: string;
};

const SignalSearchInput = ({
  selectedTickers,
  onSelectedTickersChange,
  availableTickers = [],
  placeholder = "티커 검색 (다중 선택)",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // 입력 필드의 현재 값 (필터링용)

  const filteredDropdownTickers = useMemo(() => {
    if (!inputValue) {
      // 입력값이 없으면 모든 사용 가능한 티커를 보여줌
      return availableTickers;
    }
    return availableTickers.filter((ticker) =>
      ticker.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, availableTickers]);

  const handleToggleTicker = (tickerToToggle: string) => {
    const newSelectedTickers = selectedTickers.includes(tickerToToggle)
      ? selectedTickers.filter((t) => t !== tickerToToggle) // 이미 선택된 경우 제거
      : [...selectedTickers, tickerToToggle]; // 선택되지 않은 경우 추가
    onSelectedTickersChange(newSelectedTickers);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="">
        <div className="relative w-fit max-sm:w-full">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Button
            variant={"outline"}
            className="pl-7 w-[250px] flex justify-start cursor-pointer max-sm:w-full"
          >
            {placeholder}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value);
              if (!open) {
                setOpen(true);
              }
            }}
            className="border-b"
          />
          <CommandList>
            <CommandEmpty className="px-2 py-2">
              {inputValue && filteredDropdownTickers.length === 0
                ? "해당 티커가 없습니다."
                : availableTickers.length === 0
                ? "선택 가능한 티커가 없습니다."
                : "티커를 검색하거나 선택하세요."}
            </CommandEmpty>
            {filteredDropdownTickers.length > 0 && (
              <CommandGroup>
                {filteredDropdownTickers.map((ticker) => (
                  <CommandItem
                    key={ticker}
                    value={ticker}
                    onSelect={() => {
                      handleToggleTicker(ticker);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTickers.includes(ticker)
                          ? "opacity-100" // 선택된 경우 체크 표시
                          : "opacity-0"
                      )}
                    />
                    {ticker}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SignalSearchInput;
