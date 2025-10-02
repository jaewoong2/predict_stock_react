import { BaseResponse } from "../types/common";
import {
  TOKEN_COOKIE_KEY,
  getClientCookie,
  getServerCookieAsync,
  deleteClientCookie,
} from "@/lib/cookies";

export class UnauthorizedError extends Error {
  constructor(message: string = "UNAUTHORIZED") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

// 기존 API 기본 URL 설정
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    // 개발 모드에서는 프록시를 통해 CORS 우회
    return (
      process.env.NEXT_PUBLIC_LOCAL_URL ||
      `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/api/proxy/`
    );
  }
  // 프로덕션에서는 직접 요청
  return process.env.NEXT_PUBLIC_LOCAL_URL || "https://ai-api.bamtoly.com/";
};

// O/X 예측 서비스 API 기본 URL 설정
const getOxBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return (
      process.env.NEXT_PUBLIC_OX_API_LOCAL_URL ||
      "http://localhost:8001/api/v1/"
    );
  }
  return (
    process.env.NEXT_PUBLIC_OX_API_BASE_URL ||
    "https://ox-universe.bamtoly.com/api/v1/"
  );
};

// 토큰 가져오기 (쿠키 기반, CSR/SSR 모두 지원)
const getToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") {
    return await getServerCookieAsync(TOKEN_COOKIE_KEY);
  }
  return getClientCookie(TOKEN_COOKIE_KEY);
};

// Fetch API를 위한 커스텀 래퍼 함수
const createCustomFetch = (baseUrlGetter: () => string) => {
  return async (url: string, options: RequestInit = {}) => {
    const baseUrl = baseUrlGetter();
    // baseURL이 /로 끝나고 url이 /로 시작하면 중복 제거
    const cleanUrl =
      baseUrl.endsWith("/") && url.startsWith("/") ? url.slice(1) : url;
    const fullUrl = `${baseUrl}${cleanUrl}`;
    const token = await getToken();

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        // HTTP 에러 처리
        const errorData = await response.json().catch(() => ({
          message: response.statusText,
        }));

        console.error("API 요청 실패:", {
          status: response.status,
          statusText: response.statusText,
          url: fullUrl,
          errorData,
        });

        // 401 에러 시 현재 URL에 login=1 파라미터를 추가하여 전역 모달을 띄움
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            try {
              deleteClientCookie(TOKEN_COOKIE_KEY);
              window.dispatchEvent(
                new CustomEvent("auth:unauthorized", {
                  detail: { url: fullUrl, status: response.status },
                }),
              );
            } catch (e) {
              console.error("Failed to handle 401 unauthorized:", e);
            }
          }
          throw new UnauthorizedError();
        }

        // Axios와 유사한 에러 객체 형태로 reject
        return Promise.reject({
          response: {
            data: errorData,
            status: response.status,
            statusText: response.statusText,
          },
        });
      }

      // 응답 본문이 없는 경우 (e.g., 204 No Content)
      if (
        response.status === 204 ||
        response.headers.get("content-length") === "0"
      ) {
        return { data: null };
      }

      const data = await response.json();
      // Axios와 유사하게 response.data 형태로 반환
      return { data };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }

      console.error("네트워크 또는 기타 요청 실패:", error);
      throw error;
    }
  };
};

// BaseResponse를 파싱하는 함수
const parseBaseResponse = <T>(response: any): T => {
  const result: BaseResponse<T> = response.data;

  if (!result.success) {
    throw new Error(result.error?.message || "API Error");
  }

  return result.data!;
};

// BaseResponse를 사용하지 않는 엔드포인트용 파싱 함수
const parseDirectResponse = <T>(response: any): T => {
  return response.data;
};

// 기존 API용 customFetch 인스턴스
const customFetch = createCustomFetch(getBaseUrl);

// O/X API용 customFetch 인스턴스
const oxCustomFetch = createCustomFetch(getOxBaseUrl);

// API 클라이언트 생성 함수
const createApiClient = (
  fetchInstance: ReturnType<typeof createCustomFetch>,
) => ({
  // BaseResponse를 사용하는 엔드포인트용
  get: <T>(
    url: string,
    config?: { params?: Record<string, any> },
  ): Promise<{ data: T }> => {
    let urlWithParams = url;
    if (config?.params) {
      const query = new URLSearchParams(config.params).toString();
      if (query) {
        urlWithParams += `?${query}`;
      }
    }
    return fetchInstance(urlWithParams, { method: "GET" });
  },

  // BaseResponse를 파싱하는 get 메서드
  getWithBaseResponse: <T>(
    url: string,
    config?: { params?: Record<string, any> },
  ): Promise<T> => {
    let urlWithParams = url;
    if (config?.params) {
      const query = new URLSearchParams(config.params).toString();
      if (query) {
        urlWithParams += `?${query}`;
      }
    }
    return fetchInstance(urlWithParams, { method: "GET" }).then((response) =>
      parseBaseResponse<T>(response),
    );
  },

  // 직접 응답을 파싱하는 get 메서드 (BaseResponse 사용하지 않는 엔드포인트용)
  getDirect: <T>(
    url: string,
    config?: { params?: Record<string, any> },
  ): Promise<T> => {
    let urlWithParams = url;
    if (config?.params) {
      const query = new URLSearchParams(config.params).toString();
      if (query) {
        urlWithParams += `?${query}`;
      }
    }
    return fetchInstance(urlWithParams, { method: "GET" }).then((response) =>
      parseDirectResponse<T>(response),
    );
  },

  post: <T>(
    url: string,
    data?: any,
    config?: RequestInit,
  ): Promise<{ data: T }> => {
    return fetchInstance(url, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // BaseResponse를 파싱하는 post 메서드
  postWithBaseResponse: <T>(
    url: string,
    data?: any,
    config?: RequestInit,
  ): Promise<T> => {
    return fetchInstance(url, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => parseBaseResponse<T>(response));
  },

  // 직접 응답을 파싱하는 post 메서드
  postDirect: <T>(
    url: string,
    data?: any,
    config?: RequestInit,
  ): Promise<T> => {
    return fetchInstance(url, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => parseDirectResponse<T>(response));
  },

  put: <T>(
    url: string,
    data?: any,
    config?: RequestInit,
  ): Promise<{ data: T }> => {
    return fetchInstance(url, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // BaseResponse를 파싱하는 put 메서드
  putWithBaseResponse: <T>(
    url: string,
    data?: any,
    config?: RequestInit,
  ): Promise<T> => {
    return fetchInstance(url, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    }).then((response) => parseBaseResponse<T>(response));
  },

  delete: <T>(url: string, config?: RequestInit): Promise<{ data: T }> => {
    return fetchInstance(url, { ...config, method: "DELETE" });
  },

  // BaseResponse를 파싱하는 delete 메서드
  deleteWithBaseResponse: <T>(
    url: string,
    config?: RequestInit,
  ): Promise<T> => {
    return fetchInstance(url, { ...config, method: "DELETE" }).then(
      (response) => parseBaseResponse<T>(response),
    );
  },
});

// 기존 API 클라이언트 (기존 서비스들이 사용)
const api = createApiClient(customFetch);

// O/X 예측 서비스 API 클라이언트 (새로운 서비스들이 사용)
export const oxApi = createApiClient(oxCustomFetch);

// O/X API baseURL 가져오기 (OAuth 등에서 사용)
export { getOxBaseUrl };

export default api;
