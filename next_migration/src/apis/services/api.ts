export interface ApiRequestConfig extends RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: any;
  stringfy?: boolean;
}

export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://api-habbits.bamtoly.com"; //  여기에 실제 API 기본 URL을 넣으세요

export const http = async <T>(
  endpoint: string,
  { method = "GET", headers = {}, stringfy = true, body }: ApiRequestConfig,
): Promise<T> => {
  const { cookies } = await import("next/headers");
  const token = (await cookies()).get("access_token")?.value;

  const config: RequestInit = {
    method,
    headers: stringfy
      ? {
          "Content-Type": "application/json",
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      : {
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
  };

  if (stringfy && body) {
    config.body = JSON.stringify(body);
  } else {
    config.body = body;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("API Server Error:", error);
    throw error;
  }
};
