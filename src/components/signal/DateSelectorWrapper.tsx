import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { DateSelector } from "./DateSelector";
import { useEffect, useState } from "react";
import { formatDate } from "date-fns";

type Props = {
  // 현재는 props가 없지만, 필요시 추가할 수 있습니다.
  popover?: boolean; // Popover 사용 여부
};

const DateSelectorWrapper = ({ popover }: Props) => {
  const { date, setParams } = useSignalSearchParams();
  const todayString = formatDate(new Date(), "yyyy-MM-dd");
  const submittedDate = date ?? todayString;
  const [selectedDate, setSelectedDate] = useState<string>(submittedDate);

  useEffect(() => {
    setSelectedDate(submittedDate);
  }, [submittedDate]);

  return (
    <DateSelector
      popover={popover}
      selectedDate={selectedDate}
      onDateChange={(date) => {
        setSelectedDate(date);
        setParams({ date, page: "0" });
      }}
    />
  );
};

export default DateSelectorWrapper;
