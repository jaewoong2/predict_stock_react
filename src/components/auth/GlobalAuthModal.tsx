"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";
import { useAuth } from "@/hooks/useAuth";

export default function GlobalAuthModal() {
  const search = useSearchParams();
  const router = useRouter();
  const { showLoginModal, hideLogin } = useAuth();

  const shouldOpenFromUrl = useMemo(() => search?.get("login") === "1", [search]);
  const isOpen = showLoginModal || shouldOpenFromUrl;

  const handleClose = useCallback(() => {
    hideLogin();
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("login") === "1") {
        url.searchParams.delete("login");
        router.replace(url.toString());
      }
    } catch {}
  }, [hideLogin, router]);

  return <LoginModal isOpen={isOpen} onClose={handleClose} />;
}
