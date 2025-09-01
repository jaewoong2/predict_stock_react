"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";
import { useAuth } from "@/hooks/useAuth";

export default function GlobalLoginModal() {
  const search = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const shouldOpen = useMemo(() => {
    return search?.get("login") === "1";
  }, [search]);

  const handleClose = useCallback(() => {
    // 로그인 성공 시 쿼리 파라미터 정리
    if (isAuthenticated) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("login");
        router.replace(url.toString());
      } catch (e) {
        // 실패해도 치명적이지 않음
      }
    }
  }, [isAuthenticated, router]);

  if (!shouldOpen) return null;

  return <LoginModal isOpen={true} onClose={handleClose} />;
}

