"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FastAverageColor } from "fast-average-color";

import { cn } from "@/lib/utils";
import { LogoAvatar } from "./LogoAvatar";
import { PredictionStatus } from "@/types/prediction";

const FALLBACK_PALETTE = [
  "#E6F4FF",
  "#E9F7EF",
  "#FDF2F8",
  "#FFF4E6",
  "#EDE9FE",
  "#F2FCE5",
  "#E0F2FE",
  "#FFE4F1",
];

const statusDot: Record<PredictionStatus, string> = {
  [PredictionStatus.PENDING]: "bg-slate-300/70",
  [PredictionStatus.LOCKED]: "bg-slate-300/70",
  [PredictionStatus.CORRECT]: "bg-emerald-300/80",
  [PredictionStatus.INCORRECT]: "bg-rose-300/80",
  [PredictionStatus.VOID]: "bg-amber-300/80",
};

function hashToColor(symbol: string) {
  const code = symbol
    .toUpperCase()
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_PALETTE[code % FALLBACK_PALETTE.length];
}

function hexToRgb(hex: string) {
  let sanitized = hex.replace("#", "");
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(sanitized, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance(r: number, g: number, b: number) {
  const [rr, gg, bb] = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

interface TickerAvatarProps {
  symbol: string;
  status?: PredictionStatus;
  size?: number;
  className?: string;
}

export function TickerAvatar({
  symbol,
  status,
  size = 32,
  className,
}: TickerAvatarProps) {
  const fallbackColor = useMemo(() => hashToColor(symbol), [symbol]);
  const fallbackLuminance = useMemo(() => {
    const { r, g, b } = hexToRgb(fallbackColor);
    return getLuminance(r, g, b);
  }, [fallbackColor]);

  const fallbackIsDark = fallbackLuminance < 0.55;

  const [background, setBackground] = useState<string>(fallbackColor);
  const [isDark, setIsDark] = useState(fallbackIsDark);
  const [hasImage, setHasImage] = useState(true);

  useEffect(() => {
    setBackground(fallbackColor);
    setHasImage(true);
    setIsDark(fallbackIsDark);
  }, [fallbackColor, fallbackIsDark, symbol]);

  const handleImageLoad = useCallback(
    (img: HTMLImageElement) => {
      const src = img.currentSrc || img.src;
      try {
        const url = new URL(src, window.location.href);
        const isSameOrigin = url.origin === window.location.origin;
        if (!isSameOrigin) {
          setHasImage(true);
          setBackground(fallbackColor);
          setIsDark(fallbackIsDark);
          return;
        }
      } catch {
        // fallback if URL parsing fails (e.g., data URI)
      }

      const fac = new FastAverageColor();
      fac
        .getColorAsync(img, {
          defaultColor: [240, 240, 240, 1],
          mode: "dominant",
        })
        .then((color) => {
          const [r, g, b] = color.value;
          const luminance = getLuminance(r, g, b);

          if (luminance > 0.82) {
            setBackground(fallbackColor);
            setIsDark(fallbackIsDark);
            setHasImage(true);
            return;
          }

          setBackground(color.rgba);
          setIsDark(color.isDark);
          setHasImage(true);
        })
        .catch(() => {
          setBackground(fallbackColor);
          setIsDark(fallbackIsDark);
        })
        .finally(() => fac.destroy());
    },
    [fallbackColor, fallbackIsDark],
  );

  const handleImageError = useCallback(() => {
    setHasImage(false);
    setBackground(fallbackColor);
    setIsDark(fallbackIsDark);
  }, [fallbackColor, fallbackIsDark]);

  const initials = useMemo(() => symbol.slice(0, 2).toUpperCase(), [symbol]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full text-[10px] font-semibold uppercase shadow-sm transition-colors select-none",
        isDark ? "text-white" : "text-slate-900",
        className,
      )}
      style={{ width: size, height: size, backgroundColor: background }}
    >
      {hasImage ? (
        <LogoAvatar
          symbol={symbol}
          size={size}
          className="h-full w-full bg-transparent p-0"
          onLoad={(e) => handleImageLoad(e.currentTarget)}
          onError={handleImageError}
        />
      ) : (
        <span>{initials}</span>
      )}

      {status && (
        <span
          className={cn(
            "absolute top-0 left-0 h-2 w-2 -translate-x-1 -translate-y-1 rounded-full border border-white/60 dark:border-black/40",
            statusDot[status],
          )}
        />
      )}
    </div>
  );
}
