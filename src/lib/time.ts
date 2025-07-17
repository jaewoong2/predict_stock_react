import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("ko");
dayjs.extend(relativeTime);

export const getYesterDay = (date: string | number | Date = new Date()) => {
  const current = new Date(date);
  current.setDate(current.getDate() - 1);
  return current;
};

export const getRelativeTime = (date: string | number | Date): string => {
  return dayjs(new Date(date)).fromNow();
};

export const getYYYYMMDD = (
  date: string | number | Date = new Date(),
): string => {
  return dayjs(new Date(date)).format("YYYY-MM-DD");
};

export const getFullDate = (
  date: string | number | Date = new Date(),
): string => {
  return dayjs(new Date(date)).format("YYYY-MM-DD HH:mm:ss");
};

export const getKoreanYYYYMMDD = (date: string | number | Date): string => {
  const formattedDate = dayjs(date).format("YYYY년 MM월 DD일");
  return formattedDate;
};
