import { useState, useEffect, useCallback } from "react";

type StorageType = "localStorage" | "sessionStorage";

const APP_STORAGE_KEY = "app_storage";

/**
 * 스토리지에서 전체 데이터를 한 번에 읽어옵니다.
 */
const getFullStorage = (storage: StorageType): Record<string, any> => {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const rawData = window[storage].getItem(APP_STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : {};
  } catch (error) {
    console.error("Error reading from storage:", error);
    return {};
  }
};

/**
 * 스토리지에 전체 데이터를 한 번에 저장합니다.
 */
const setFullStorage = (
  storage: StorageType,
  data: Record<string, any>,
): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window[storage].setItem(APP_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error writing to storage:", error);
    return false;
  }
};

/**
 * 스토리지에서 특정 키의 값을 가져옵니다.
 */
export function getStorageItem<T>(
  key: string,
  defaultValue: T,
  storage: StorageType = "localStorage",
): T {
  const allData = getFullStorage(storage);
  return allData[key] ?? defaultValue;
}

/**
 * 스토리지에 특정 키의 값을 저장합니다.
 */
export function setStorageItem<T>(
  key: string,
  value: T,
  storage: StorageType = "localStorage",
): boolean {
  const allData = getFullStorage(storage);
  allData[key] = value;
  return setFullStorage(storage, allData);
}

/**
 * 스토리지에서 특정 키의 값을 제거합니다.
 */
export function removeStorageItem(
  key: string,
  storage: StorageType = "localStorage",
): boolean {
  const allData = getFullStorage(storage);
  if (key in allData) {
    delete allData[key];
    return setFullStorage(storage, allData);
  }
  return true; // 키가 존재하지 않아도 성공으로 처리
}

/**
 * localStorage와 동기화되는 React state를 관리하는 커스텀 훅
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  storage: StorageType = "localStorage",
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStorageItem(key, initialValue, storage);
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setStorageItem(key, valueToStore, storage);
    },
    [key, storage, storedValue],
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === APP_STORAGE_KEY && event.newValue) {
        try {
          const allData = JSON.parse(event.newValue);
          if (key in allData && allData[key] !== storedValue) {
            setStoredValue(allData[key]);
          }
        } catch (error) {
          console.error("Error parsing storage change event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
