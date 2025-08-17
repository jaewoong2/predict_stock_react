"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";

export function withDateValidation<T extends object>(
  Component: React.ComponentType<T>,
) {
  return function WrappedComponent(props: T) {
    const { date, setParams } = useSignalSearchParams();
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 디바운스된 파라미터 업데이트 및 라우팅 함수
    const debouncedUpdate = (newDate: string, delay = 300) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setParams({ date: newDate });
        router.replace(`?date=${newDate}`, { scroll: false });
        timeoutRef.current = null;
      }, delay);
    };

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

      // 날짜 검증을 위한 함수
      const validateAndUpdateDate = () => {
        if (date) {
          const currentDate = new Date(date);
          let needsUpdate = false;
          let newDate = date;

          // 날짜가 오늘을 초과하면 오늘로 리다이렉트
          if (currentDate > today) {
            newDate = todayFormatted;
            needsUpdate = true;
          }

          // 날짜가 한 달 전보다 이전이면 한 달 전으로 리다이렉트
          else if (currentDate < oneMonthAgo) {
            newDate = todayFormatted;
            needsUpdate = true;
          }

          // 날짜가 주말이면 가장 가까운 평일로 리다이렉트
          else if (isWeekend(currentDate)) {
            newDate = getClosestWorkingDay(currentDate);
            needsUpdate = true;
          }

          if (needsUpdate) {
            debouncedUpdate(newDate);
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

          debouncedUpdate(defaultDate, 0); // 초기 설정은 지연 없이 즉시 적용
        }
      };

      validateAndUpdateDate();

      // 컴포넌트 언마운트 시 타이머 정리
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [date, setParams, router]);

    return <Component {...props} />;
  };
}
