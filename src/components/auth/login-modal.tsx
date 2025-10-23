"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Mail } from "lucide-react";
import {
  useAuth,
  useOAuthCallback,
  useOAuthLogin,
  useSendMagicLink,
  useMyProfile,
} from "@/hooks/useAuth";
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

// Social Login Icons
const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const KakaoIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#3C1E1E">
    <path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.77 1.876 5.204 4.678 6.548-.198.732-.737 2.758-.846 3.188-.133.524.192.518.405.376.169-.113 2.711-1.816 3.152-2.113C10.238 18.897 11.107 19 12 19c5.523 0 10-3.477 10-7.75S17.523 3 12 3z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const oauthLogin = useOAuthLogin();
  const sendMagicLink = useSendMagicLink();
  const handleOAuthCallback = useOAuthCallback();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  // Magic Link 전송 후 인증 상태 폴링
  const { data: pollingProfile } = useMyProfile({
    enabled: isPolling && !isAuthenticated,
    refetchInterval: isPolling && !isAuthenticated ? 2000 : false, // 2초마다 폴링
    retry: false,
  });

  // 폴링으로 인증 성공 감지
  useEffect(() => {
    if (pollingProfile && isPolling) {
      setIsPolling(false);
      toast.success("로그인되었습니다!", {
        description: `환영합니다, ${pollingProfile.nickname}님!`,
      });
      onClose();
    }
  }, [pollingProfile, isPolling, onClose]);

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
    (provider: "google" | "kakao" | "apple") => {
      if (!clientRedirect) return;
      oauthLogin.mutate({ provider, client_redirect: clientRedirect });
    },
    [clientRedirect, oauthLogin],
  );

  const handleEmailLogin = useCallback(() => {
    if (!email || !email.includes("@")) {
      toast.error("유효한 이메일을 입력해주세요");
      return;
    }

    sendMagicLink.mutate(email, {
      onSuccess: () => {
        toast.success("매직 링크를 전송했습니다!", {
          description: "이메일을 확인해주세요",
        });
        // 폴링 시작
        setIsPolling(true);
      },
      onError: (error) => {
        console.error("Magic link error:", error);
        toast.error("매직 링크 전송에 실패했습니다", {
          description: "잠시 후 다시 시도해주세요",
        });
      },
    });
  }, [email, sendMagicLink]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setEmail("");
          setIsPolling(false);
          sendMagicLink.reset();
        }
      }}
    >
      <DialogContent className="gap-0 p-0 sm:max-w-[380px]">
        {/* Header with Icon */}
        <div className="flex flex-col items-center px-6 pt-8 pb-6">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <Mail className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          </div>
          <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50">
            이메일로 로그인
          </DialogTitle>
        </div>

        {/* Form */}
        <div className="space-y-4 px-6 pb-6">
          {/* Email Input */}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="youremail@example.com"
                autoFocus={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={
                  sendMagicLink.isPending ||
                  isLoading ||
                  isVerifying ||
                  isPolling
                }
                className="ios-input-zoom--sm h-11 border-slate-200 bg-slate-50 pl-10 text-base dark:border-slate-800 dark:bg-slate-900"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isPolling) handleEmailLogin();
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className="h-12 w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
            disabled={
              sendMagicLink.isPending || isLoading || isVerifying || isPolling
            }
            onClick={handleEmailLogin}
          >
            {sendMagicLink.isPending || isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                매직 링크 전송 중...
              </>
            ) : isPolling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                이메일 확인 대기 중...
              </>
            ) : (
              <>시작하기</>
            )}
          </Button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                또는 간편 로그인
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2">
            <button
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              disabled={
                isLoading ||
                oauthLogin.isPending ||
                isAuthenticated ||
                isVerifying
              }
              onClick={() => onLogin("google")}
            >
              {oauthLogin.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              <span>Google로 로그인</span>
            </button>

            <button
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border-0 bg-[#FEE500] text-sm font-medium text-[#3C1E1E] transition-all hover:bg-[#FDD835] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                isLoading ||
                oauthLogin.isPending ||
                isAuthenticated ||
                isVerifying
              }
              onClick={() => onLogin("kakao")}
            >
              {oauthLogin.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KakaoIcon />
              )}
              <span>카카오로 로그인</span>
            </button>

            <button
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border-0 bg-black text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                isLoading ||
                oauthLogin.isPending ||
                isAuthenticated ||
                isVerifying
              }
              onClick={() => onLogin("apple")}
            >
              {oauthLogin.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AppleIcon />
              )}
              <span>Apple로 로그인</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
