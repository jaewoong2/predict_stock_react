// 환경에 따른 API 기본 URL 설정
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_API_LOCAL_URL || "http://localhost:8000/";
  }
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://pef3ppbc4k.execute-api.ap-northeast-2.amazonaws.com/dev/"
  );
};

// Fetch API를 위한 커스텀 래퍼 함수
const customFetch = async (url: string, options: RequestInit = {}) => {
  const fullUrl = `${getBaseUrl()}${url.startsWith("/") ? url.slice(1) : url}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
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
  } catch (error) {
    console.error("네트워크 또는 기타 요청 실패:", error);
    throw error;
  }
};

// Axios와 유사한 인터페이스를 가진 api 객체
const api = {
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
    return customFetch(urlWithParams, { method: "GET" });
  },

  post: <T>(
    url: string,
    data?: any,
    config?: RequestInit,
  ): Promise<{ data: T }> => {
    return customFetch(url, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put: <T>(
    url: string,
    data?: any,
    config?: RequestInit,
  ): Promise<{ data: T }> => {
    return customFetch(url, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: <T>(url: string, config?: RequestInit): Promise<{ data: T }> => {
    return customFetch(url, { ...config, method: "DELETE" });
  },
};

export default api;
