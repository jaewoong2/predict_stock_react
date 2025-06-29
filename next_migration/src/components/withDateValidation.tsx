"use client";

import { useEffect } from "react";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";
import { useRouter } from "next/navigation";

export function withDateValidation<T extends object>(
  Component: React.ComponentType<T>
) {
  return function WrappedComponent(props: T) {
    const { date, setParams } = useSignalSearchParams();
    const router = useRouter();

    useEffect(() => {
      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);

      const todayFormatted = today.toISOString().split("T")[0];

      const isWeekend = (date: Date) =>
        date.getDay() === 0 || date.getDay() === 6;

      const getClosestWorkingDay = (date: Date) => {
        const closestDate = new Date(date);
        while (isWeekend(closestDate)) {
          closestDate.setDate(closestDate.getDate() - 1);
        }
        return closestDate.toISOString().split("T")[0];
      };

      const isBefore11AM = (date: Date) => date.getHours() < 11;

      if (date) {
        const currentDate = new Date(date);

        // 날짜가 오늘을 초과하면 오늘로 리다이렉트
        if (currentDate > today) {
          setParams({ date: todayFormatted });
          router.replace(`?date=${todayFormatted}`);
        }

        // 날짜가 한 달 전보다 이전이면 한 달 전으로 리다이렉트
        if (currentDate < oneMonthAgo) {
          setParams({ date: todayFormatted });
          router.replace(`?date=${todayFormatted}`);
        }

        // 날짜가 주말이면 가장 가까운 평일로 리다이렉트
        if (isWeekend(currentDate)) {
          const closestWorkingDay = getClosestWorkingDay(currentDate);
          setParams({ date: closestWorkingDay });
          router.replace(`?date=${closestWorkingDay}`);
        }
      } else {
        // 날짜가 없으면 오늘 날짜로 설정
        let defaultDate = todayFormatted;

        // 오늘이 오전 11시 이전이면 어제 또는 가장 가까운 평일로 설정
        if (isBefore11AM(today)) {
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          defaultDate = getClosestWorkingDay(yesterday);
        }

        // 오늘이 주말이면 가장 가까운 평일로 설정
        if (isWeekend(today)) {
          defaultDate = getClosestWorkingDay(today);
        }

        setParams({ date: defaultDate });
        router.replace(`?date=${defaultDate}`);
      }
    }, [date, setParams, router]);

    return <Component {...props} />;
  };
}
