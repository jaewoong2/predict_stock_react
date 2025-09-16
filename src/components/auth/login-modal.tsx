"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const SENSITIVE_CALLBACK_PARAMS = [
  "token",
  "user_id",
  "nickname",
  "provider",
  "is_new_user",
] as const;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const oauthLogin = useOAuthLogin();
  const handleOAuthCallback = useOAuthCallback();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  // 현재 페이지를 콜백 대상으로 사용 (절대 URL)
  const clientRedirect = useMemo(() => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || "";
    if (!origin) return "";

    const query = searchParams?.toString();
    return query ? `${origin}${pathname}?${query}` : `${origin}${pathname}`;
  }, [pathname, searchParams]);

  // OAuth 콜백 파라미터가 있다면 처리하여 로그인 상태로 전환
  useEffect(() => {
    if (!isOpen || isVerifying) return;
    if (!searchParams) return;
    if (!searchParams.has("token")) return;

    setIsVerifying(true);

    const result = handleOAuthCallback(searchParams);

    if (result) {
      const nextParams = new URLSearchParams(searchParams.toString());
      SENSITIVE_CALLBACK_PARAMS.forEach((key) => nextParams.delete(key));
      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
      onClose();
    } else {
      toast.error("로그인에 실패했습니다.", {
        description: "토큰 검증에 실패했습니다. 다시 시도해주세요.",
      });
      const nextParams = new URLSearchParams(searchParams.toString());
      SENSITIVE_CALLBACK_PARAMS.forEach((key) => nextParams.delete(key));
      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    }

    setIsVerifying(false);
  }, [
    handleOAuthCallback,
    isOpen,
    isVerifying,
    onClose,
    pathname,
    router,
    searchParams,
  ]);

  const onLogin = useCallback(
    (provider: "google" | "kakao") => {
      if (!clientRedirect) return;
      oauthLogin.mutate({ provider, client_redirect: clientRedirect });
    },
    [clientRedirect, oauthLogin],
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
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
            disabled={
              isLoading ||
              oauthLogin.isPending ||
              isAuthenticated ||
              isVerifying
            }
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
            disabled={
              isLoading ||
              oauthLogin.isPending ||
              isAuthenticated ||
              isVerifying
            }
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
