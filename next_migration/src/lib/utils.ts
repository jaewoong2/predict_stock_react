import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformToBoolean(
  value: string | number | object | any[] | undefined | null,
) {
  if (value === undefined || value === null) return false;

  if (typeof value === "string") {
    if (value === "") return false;
    return true;
  }

  if (typeof value === "number") {
    if (Number.isNaN(value)) return false;
    true;
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return Object.keys(value).length > 0;
  }

  return false;
}

export type EventStatus = "ongoing" | "upcoming" | "ended";

export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms ?? 1000);
  });
}
