/**
 * 브라우저 스토리지 작업을 위한 유틸리티 함수 모음
 */

type StorageType = "localStorage" | "sessionStorage";

interface StorageOptions {
  storage?: StorageType;
  prefix?: string;
}

const defaultOptions: StorageOptions = {
  storage: "localStorage",
  prefix: "app_",
};

/**
 * 스토리지에서 값을 가져옵니다
 * @param key 스토리지 키
 * @param defaultValue 값이 없을 경우 반환할 기본값
 * @param options 스토리지 옵션
 * @returns 저장된 값 또는 기본값
 */
export function getStorageItem<T>(
  key: string,
  defaultValue: T,
  options: StorageOptions = {},
): T {
  // 서버 사이드에서 실행 시 기본값 반환
  if (typeof window === "undefined") {
    return defaultValue;
  }

  const { storage = defaultOptions.storage, prefix = defaultOptions.prefix } =
    options;
  const prefixedKey = `${prefix}${key}`;

  try {
    if (!storage) {
      console.warn(`Storage type ${storage} is not supported.`);
      return defaultValue;
    }
    const item = window[storage].getItem(prefixedKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from ${storage}:`, error);
    return defaultValue;
  }
}

/**
 * 스토리지에 값을 저장합니다
 * @param key 스토리지 키
 * @param value 저장할 값
 * @param options 스토리지 옵션
 * @returns 성공 여부
 */
export function setStorageItem<T>(
  key: string,
  value: T,
  options: StorageOptions = {},
): boolean {
  // 서버 사이드에서 실행 시 false 반환
  if (typeof window === "undefined") {
    return false;
  }

  const { storage = defaultOptions.storage, prefix = defaultOptions.prefix } =
    options;
  const prefixedKey = `${prefix}${key}`;

  try {
    if (!storage) {
      console.warn(`Storage type ${storage} is not supported.`);
      return false;
    }
    window[storage].setItem(prefixedKey, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to ${storage}:`, error);
    return false;
  }
}
/**
 * 스토리지에서 값을 제거합니다
 * @param key 스토리지 키
 * @param options 스토리지 옵션
 * @returns 성공 여부
 */
export function removeStorageItem(
  key: string,
  options: StorageOptions = {},
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const { storage = defaultOptions.storage, prefix = defaultOptions.prefix } =
    options;
  const prefixedKey = `${prefix}${key}`;

  try {
    if (!storage) {
      console.warn(`Storage type ${storage} is not supported.`);
      return false;
    }
    window[storage].removeItem(prefixedKey);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from ${storage}:`, error);
    return false;
  }
}

import { useState, useEffect } from "react";

/**
 * localStorage와 동기화되는 React state를 관리하는 커스텀 훅
 * @param key 스토리지 키
 * @param initialValue 초기값
 * @param options 스토리지 옵션
 * @returns [storedValue, setValue] 튜플
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: StorageOptions = {},
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStorageItem(key, initialValue, options);
  });

  useEffect(() => {
    setStorageItem(key, storedValue, options);
  }, [key, storedValue, options]);

  return [storedValue, setStoredValue] as const;
}
