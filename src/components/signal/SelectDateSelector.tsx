"use client";

import { format, subDays, isWeekend, subWeeks } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectDateSelectorProps {
  selectedDate: string;
  onDateChange: (dateStr: string) => void;
}

// 영업일만 필터링하는 함수 (주말 제외)
function getBusinessDays(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  let currentDate = today;
  let count = 0;

  while (count < days) {
    if (!isWeekend(currentDate)) {
      dates.push(format(currentDate, "yyyy-MM-dd"));
      count++;
    }
    currentDate = subDays(currentDate, 1);
  }

  return dates;
}

// 날짜 옵션 생성
function generateDateOptions(): { value: string; label: string; group?: string }[] {
  const options: { value: string; label: string; group?: string }[] = [];
  
  // 오늘
  const today = format(new Date(), "yyyy-MM-dd");
  options.push({
    value: today,
    label: `오늘 (${format(new Date(), "M월 d일", { locale: ko })})`,
    group: "최근"
  });

  // 최근 7 영업일
  const recentDays = getBusinessDays(8).slice(1, 8); // 오늘 제외하고 7일
  recentDays.forEach(date => {
    const dateObj = new Date(date);
    options.push({
      value: date,
      label: format(dateObj, "M월 d일 (eee)", { locale: ko }),
      group: "최근"
    });
  });

  // 지난주들 (최근 4주)
  for (let week = 1; week <= 4; week++) {
    const weekStart = subWeeks(new Date(), week);
    // 해당 주의 영업일들 생성
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      const currentDay = subDays(weekStart, -day);
      if (!isWeekend(currentDay) && currentDay <= new Date()) {
        weekDays.push(format(currentDay, "yyyy-MM-dd"));
      }
    }
    
    weekDays.forEach(date => {
      const dateObj = new Date(date);
      options.push({
        value: date,
        label: format(dateObj, "M월 d일 (eee)", { locale: ko }),
        group: `${week}주 전`
      });
    });
  }

  return options;
}

export function SelectDateSelector({
  selectedDate,
  onDateChange,
}: SelectDateSelectorProps) {
  const dateOptions = generateDateOptions();
  
  // 선택된 날짜의 라벨 찾기
  const selectedOption = dateOptions.find(option => option.value === selectedDate);
  const selectedLabel = selectedOption 
    ? selectedOption.label.replace(/^\w+\s+\(/, '').replace(/\)$/, '') // "오늘 (12월 25일)" -> "12월 25일"
    : format(new Date(selectedDate), "M월 d일", { locale: ko });

  // 그룹별로 옵션들 정리
  const groupedOptions = dateOptions.reduce((groups, option) => {
    const group = option.group || "기타";
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, typeof dateOptions>);

  return (
    <Select value={selectedDate} onValueChange={onDateChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          {selectedLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedOptions).map(([groupName, options]) => (
          <div key={groupName}>
            {groupName !== "기타" && (
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {groupName}
              </div>
            )}
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}