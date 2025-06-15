import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  popover?: boolean; // Popover 사용 여부
  onDateChange?: (date: Date | undefined) => void;
}

export function DatePicker({ date, onDateChange, popover }: DatePickerProps) {
  if (!popover) {
    // Popover가 필요 없는 경우 Calendar 컴포넌트만 렌더링
    return (
      <Calendar
        locale={ko} // Calendar에도 한국어 로케일 적용
        mode="single"
        className="border rounded-md bg-background"
        selected={date}
        onSelect={onDateChange}
        disabled={(date) => {
          // 주말(토요일: 6, 일요일: 0) 또는 미래 날짜 비활성화
          const day = date.getDay();
          const isWeekend = day === 0 || day === 6;
          const isFuture = date > new Date();
          return isWeekend || isFuture;
        }}
      />
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal shadow-none cursor-pointer max-sm:w-full"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: ko })
          ) : (
            <span>날짜를 선택하세요</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          locale={ko} // Calendar에도 한국어 로케일 적용
          mode="single"
          selected={date}
          onSelect={onDateChange}
          disabled={(date) => {
            // 주말(토요일: 6, 일요일: 0) 또는 미래 날짜 비활성화
            const day = date.getDay();
            const isWeekend = day === 0 || day === 6;
            const isFuture = date > new Date();
            return isWeekend || isFuture;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
