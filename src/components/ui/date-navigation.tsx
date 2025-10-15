"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addDays, subDays, parseISO, isToday, isFuture, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

interface DateNavigationProps {
  selectedDate?: Date | string;
  onDateChange?: (date: Date) => void;
  showCalendar?: boolean;
  className?: string;
}

export function DateNavigation({
  selectedDate,
  onDateChange,
  showCalendar = true,
  className,
}: DateNavigationProps) {
  const [currentDate, setCurrentDate] = React.useState<Date>(() => {
    if (!selectedDate) return new Date();
    return typeof selectedDate === "string" ? parseISO(selectedDate) : selectedDate;
  });

  React.useEffect(() => {
    if (selectedDate) {
      const date = typeof selectedDate === "string" ? parseISO(selectedDate) : selectedDate;
      setCurrentDate(date);
    }
  }, [selectedDate]);

  const handlePreviousDay = () => {
    const newDate = subDays(currentDate, 1);
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const handleNextDay = () => {
    const newDate = addDays(currentDate, 1);
    const today = startOfDay(new Date());
    
    // Prevent going to future dates
    if (startOfDay(newDate) > today) {
      return;
    }
    
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const today = startOfDay(new Date());
      const selectedDay = startOfDay(date);
      
      // If future date is selected, use today instead
      if (selectedDay > today) {
        const todayDate = new Date();
        setCurrentDate(todayDate);
        onDateChange?.(todayDate);
        return;
      }
      
      setCurrentDate(date);
      onDateChange?.(date);
    }
  };

  // Check if current date is today
  const isTodaySelected = isToday(currentDate);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePreviousDay}
        className="h-8 w-8"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {showCalendar ? (
        <DatePicker
          date={currentDate}
          onDateChange={handleDateSelect}
          popover={true}
        />
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          <span>{format(currentDate, "yyyy-MM-dd")}</span>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextDay}
        className="h-8 w-8"
        aria-label="Next day"
        disabled={isTodaySelected}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
