"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Search, Newspaper, Brain } from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full overflow-hidden border-b py-8 md:py-12">
      {/* 그라디언트 배경 */}
      <div className="from-background via-background/95 to-primary/10 absolute inset-0 z-0 bg-gradient-to-br" />

      {/* 백그라운드 그리드 패턴 */}
      {/* <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" /> */}

      <div className="relative z-10 container mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* 상단 배지 */}
          <div className="bg-primary/10 text-primary mb-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
            <TrendingUp size={14} className="mr-1" /> AI 시장 분석
          </div>

          <h1 className="from-primary to-primary-foreground bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl">
            오늘의 미국 주식 시장은?
          </h1>

          <p className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg">
            AI로 분석 하고 시장을 예측 했어요.
          </p>

          {/* 핵심 기능 아이콘 */}
          <div className="flex justify-center gap-6 py-4">
            <div className="flex flex-col items-center">
              <div className="bg-muted mb-2 rounded-full p-3">
                <Search className="text-primary h-5 w-5" />
              </div>
              <span className="text-xs font-medium">AI 시장 분석</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-muted mb-2 rounded-full p-3">
                <BarChart3 className="text-primary h-5 w-5" />
              </div>
              <span className="text-xs font-medium">AI 차트 분석</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-muted mb-2 rounded-full p-3">
                <Newspaper className="text-primary h-5 w-5" />
              </div>
              <span className="text-xs font-medium">AI 뉴스 분석</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-muted mb-2 rounded-full p-3">
                <Brain className="text-primary h-5 w-5" />
              </div>
              <span className="text-xs font-medium">AI의 종목 추천</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
