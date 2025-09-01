"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, showLoginModal, hideLogin } = useAuth();

  useEffect(() => {
    // 로그인하지 않은 상태에서 모달을 자동으로 표시
    if (!isLoading && !isAuthenticated) {
      // showLogin은 useAuth에서 자동으로 호출됩니다
    }
  }, [isAuthenticated, isLoading]);

  const handleLoginModalClose = () => {
    // 로그인 모달을 닫을 수 없도록 합니다 (로그인이 필요함)
    if (!isAuthenticated) {
      return;
    }
    hideLogin();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">로그인이 필요합니다</h2>
            <p className="text-muted-foreground">
              이 페이지에 접근하려면 로그인이 필요합니다.
            </p>
          </div>
        </div>
        <LoginModal isOpen={showLoginModal} onClose={handleLoginModalClose} />
      </>
    );
  }

  return <>{children}</>;
}
