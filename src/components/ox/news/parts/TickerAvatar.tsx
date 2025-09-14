"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const TickerAvatar = memo(function TickerAvatar({ ticker }: { ticker: string | null }) {
  const [error, setError] = useState(false);
  const hasTicker = !!ticker;
  const baseClasses =
    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold";

  if (!hasTicker) {
    return (
      <div
        className={cn(baseClasses, "border border-gray-200 bg-gray-100 text-gray-600")}
        aria-label="시장 뉴스"
      >
        <Newspaper className="h-5 w-5" />
      </div>
    );
  }

  const symbol = ticker!.toUpperCase();
  const logoSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}/logos/${symbol}.png`;

  return (
    <div
      className={cn(baseClasses, "border border-blue-200 bg-blue-100 text-blue-600")}
      aria-label={`${symbol} 로고`}
    >
      {!error ? (
        <Image
          src={logoSrc}
          alt={`${symbol} logo`}
          width={24}
          height={24}
          className="h-6 w-6"
          onError={() => setError(true)}
        />
      ) : (
        <span>{symbol[0] ?? "N"}</span>
      )}
    </div>
  );
});

export default TickerAvatar;

