import { parseISO, format as formatDate } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

interface DateSelectorProps {
  selectedDate: string;
  submittedDate: string;
  onDateChange: (dateStr: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function DateSelector({
  selectedDate,
  submittedDate,
  onDateChange,
  onSubmit,
  isLoading,
}: DateSelectorProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(formatDate(date, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="mb-6 p-4 border rounded-lg shadow bg-card">
      <div className="mb-1 text-sm font-medium text-gray-700">조회할 날짜 선택</div>
      <div className="flex items-center space-x-2">
        <DatePicker
          date={selectedDate ? parseISO(selectedDate) : undefined}
          onDateChange={handleDateSelect}
        />
        <Button
          onClick={onSubmit}
          disabled={isLoading || !selectedDate || selectedDate === submittedDate}
        >
          {isLoading && submittedDate === selectedDate ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          조회
        </Button>
      </div>
    </div>
  );
}
