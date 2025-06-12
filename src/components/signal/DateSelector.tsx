import { parseISO, format as formatDate } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (dateStr: string) => void;
}

export function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(formatDate(date, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <DatePicker
        date={selectedDate ? parseISO(selectedDate) : undefined}
        onDateChange={handleDateSelect}
      />
    </div>
  );
}
