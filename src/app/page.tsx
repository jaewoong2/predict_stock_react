"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
    router.push(`/dashboard?date=${formattedDate}`);
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">주식 티커 정보</h1>
    </div>
  );
}

export default Home;
