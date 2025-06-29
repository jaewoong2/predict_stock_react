"use client";
import { parseISO, format as formatDate } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (dateStr: string) => void;
  popover?: boolean; // Popover 사용 여부
}

export function DateSelector({
  selectedDate,
  onDateChange,
  popover = true,
}: DateSelectorProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(formatDate(date, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="flex items-center space-x-2 max-sm:w-full">
      <DatePicker
        date={selectedDate ? parseISO(selectedDate) : undefined}
        onDateChange={handleDateSelect}
        popover={popover}
      />
    </div>
  );
}
