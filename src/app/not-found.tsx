"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  );
}
