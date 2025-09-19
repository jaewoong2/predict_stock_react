"use client";

import Image from "next/image";
import { SyntheticEvent } from "react";

type LogoAvatarProps = {
  symbol: string;
  size?: number; // px
  className?: string;
  onLoad?: (img: SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: () => void;
};

export function LogoAvatar({
  symbol,
  size = 28,
  className,
  onLoad,
  onError,
}: LogoAvatarProps) {
  const logoBase = process.env.NEXT_PUBLIC_IMAGE_URL || "";
  const src = `${logoBase}/logos/${symbol.toUpperCase()}.png`;
  const dim = `${size}px`;

  return (
    <div
      className={
        "overflow-hidden rounded-full bg-black/10 p-[3px] " + (className || "")
      }
      style={{ width: dim, height: dim }}
    >
      <Image
        src={src}
        alt={`${symbol} logo`}
        width={size}
        height={size}
        loading="lazy"
        className="h-full w-full"
        style={{ objectFit: "contain" }}
        onLoad={onLoad}
        onError={onError}
        unoptimized
      />
    </div>
  );
}
