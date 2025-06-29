import axios from "axios";

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

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api", // Next.js rewrites에 맞춰 /api로 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터 추가 (필요시)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 요청 실패:", error);
    return Promise.reject(error);
  },
);

export default api;
