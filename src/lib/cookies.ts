// Simple cookie helpers for client and server

// Unify token cookie key with env and middleware (NEXT_PUBLIC_JWT_TOKEN_KEY)
export const TOKEN_COOKIE_KEY =
  process.env.NEXT_PUBLIC_JWT_TOKEN_KEY || "access_token";

export const getClientCookie = (key: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + key.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
};

export const setClientCookie = (
  key: string,
  value: string,
  options: { maxAgeSeconds?: number; path?: string } = {},
) => {
  if (typeof document === "undefined") return;
  const { maxAgeSeconds, path = "/" } = options;
  let cookie = `${key}=${encodeURIComponent(value)}; path=${path}`;
  if (maxAgeSeconds) cookie += `; max-age=${maxAgeSeconds}`;
  // In production over HTTPS, you may want to set secure and samesite
  document.cookie = cookie;
};

export const deleteClientCookie = (key: string, path: string = "/") => {
  if (typeof document === "undefined") return;
  document.cookie = `${key}=; path=${path}; max-age=0`;
};

// Next.js 15+ dynamic APIs are async
export const getServerCookieAsync = async (key: string): Promise<string | null> => {
  try {
    const mod = await import("next/headers");
    const c = await mod.cookies();
    return c.get(key)?.value ?? null;
  } catch {
    return null;
  }
};
