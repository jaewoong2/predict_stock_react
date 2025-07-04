"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const customRevalidateTag = async (tag: string) => {
  revalidateTag(tag);
};

export const validateAndRedirectDate = async (
  date: string | null,
  path: string,
) => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const todayFormatted = today.toISOString().split("T")[0];

  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const getClosestWorkingDay = (date: Date) => {
    const closestDate = new Date(date);
    while (isWeekend(closestDate)) {
      closestDate.setDate(closestDate.getDate() - 1);
    }
    return closestDate.toISOString().split("T")[0];
  };

  const isBefore11AM = today.getHours() < 11;
  console.log(today.getHours());

  let validDate: string;

  if (date) {
    const currentDate = new Date(date);

    // 날짜가 오늘을 초과하면 오늘로 설정
    if (currentDate > today) {
      validDate = todayFormatted;
    }
    // 날짜가 한 달 전보다 이전이면 한 달 전으로 설정
    else if (currentDate < oneMonthAgo) {
      validDate = oneMonthAgo.toISOString().split("T")[0];
    }
    // 날짜가 주말이면 가장 가까운 평일로 설정
    else if (isWeekend(currentDate)) {
      validDate = getClosestWorkingDay(currentDate);
    } else {
      validDate = date;
    }

    if (isBefore11AM) {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      validDate = getClosestWorkingDay(yesterday);
    }
  } else {
    // 날짜가 없으면 기본 날짜 설정
    validDate = todayFormatted;

    // 오전 11시 이전이면 어제 또는 가장 가까운 평일로 설정
    if (isBefore11AM) {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      validDate = getClosestWorkingDay(yesterday);
    }

    // 오늘이 주말이면 가장 가까운 평일로 설정
    if (isWeekend(today)) {
      validDate = getClosestWorkingDay(today);
    }
  }

  if (!date || date !== validDate) {
    console.log("Hello WOrld@@");
    redirect(`${path}?date=${validDate}`);
  }

  return validDate;
};
