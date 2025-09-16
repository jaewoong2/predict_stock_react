"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";
import { useAuth } from "@/hooks/useAuth";

export default function GlobalAuthModal() {
  const search = useSearchParams();
  const router = useRouter();
  const { showLoginModal, hideLogin, isAuthenticated, showLogin } = useAuth();

  const shouldOpenFromUrl = useMemo(() => search?.get("login") === "1", [search]);
  const isOpen = showLoginModal || shouldOpenFromUrl;

  const handleClose = useCallback(() => {
    // 로그인 성공 후 닫기: 상태/URL 모두 정리
    if (isAuthenticated) {
      hideLogin();
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.get("login") === "1") {
          url.searchParams.delete("login");
          router.replace(url.toString());
        }
      } catch {}
    } else {
      // 비로그인 상태에서 닫힘 이벤트가 오면 다시 열도록 유지
      showLogin();
    }
  }, [isAuthenticated, hideLogin, router, showLogin]);

  return <LoginModal isOpen={isOpen} onClose={handleClose} />;
}
