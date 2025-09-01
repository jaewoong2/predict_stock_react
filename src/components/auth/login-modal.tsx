"use client";

import { useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAuth, useOAuthCallback } from "@/hooks/useAuth";
import { useOAuthLogin } from "@/hooks/useAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const oauthLogin = useOAuthLogin();
  const handleOAuthCallback = useOAuthCallback();

  // 현재 페이지를 콜백 대상으로 사용 (절대 URL)
  const clientRedirect = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  // OAuth 콜백 파라미터가 있다면 처리하여 로그인 상태로 전환
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasTokenParam = new URLSearchParams(window.location.search).has(
      "token",
    );
    if (hasTokenParam) {
      const result = handleOAuthCallback(window.location.href);
      if (result) {
        // 성공적으로 토큰을 저장했으면 모달 닫기
        onClose();
      }
    }
  }, [handleOAuthCallback, onClose]);

  const onLogin = useCallback(
    (provider: "google" | "kakao") => {
      if (!clientRedirect) return;
      oauthLogin.mutate({ provider, client_redirect: clientRedirect });
    },
    [clientRedirect, oauthLogin],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>
            소셜 계정으로 빠르게 로그인하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <Button
            variant="default"
            className="w-full"
            disabled={isLoading || oauthLogin.isPending || isAuthenticated}
            onClick={() => onLogin("google")}
          >
            {oauthLogin.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                구글로 이동 중...
              </>
            ) : (
              <>구글로 계속하기</>
            )}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            disabled={isLoading || oauthLogin.isPending || isAuthenticated}
            onClick={() => onLogin("kakao")}
          >
            {oauthLogin.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                카카오로 이동 중...
              </>
            ) : (
              <>카카오로 계속하기</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
