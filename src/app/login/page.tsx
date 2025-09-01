"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginModal } from "@/components/auth/login-modal";

function LoginPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search?.get("next") || "/";
  const { isAuthenticated } = useAuth();

  const handleClose = useCallback(() => {
    // 인증에 성공하면 next로 이동, 아니면 모달 유지
    if (isAuthenticated) {
      router.replace(next);
    }
  }, [isAuthenticated, next, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoginModal isOpen={true} onClose={handleClose} />
    </div>
  );
}

export default function LoginPage() {
  return <LoginPageInner />;
}
