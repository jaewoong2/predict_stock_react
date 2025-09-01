"use client";

import { useCallback } from "react";
import { LoginModal } from "@/components/auth/login-modal";
import { useAuth } from "@/hooks/useAuth";

export default function GlobalAuthModal() {
  const { showLoginModal, hideLogin, isAuthenticated } = useAuth();

  const handleClose = useCallback(() => {
    // 로그인 전에는 닫기 비활성(모달 내부 onClose는 AuthGuard처럼 로그인 전 닫기 무시)
    if (isAuthenticated) hideLogin();
  }, [hideLogin, isAuthenticated]);

  return <LoginModal isOpen={showLoginModal} onClose={handleClose} />;
}

