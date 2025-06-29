import { useEffect, useState } from "react";

/**
 * Hook that returns whether the component is mounted.
 * Useful for preventing state updates on unmounted components.
 * @returns {boolean} Whether the component is mounted
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  return mounted;
}

export default useMounted;
