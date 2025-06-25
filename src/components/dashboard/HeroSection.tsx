import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Search, Newspaper, Brain } from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden border-b">
      {/* 그라디언트 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 z-0" />

      {/* 백그라운드 그리드 패턴 */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />

      <div className="container relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* 상단 배지 */}
          <div className="inline-flex items-center px-3 py-1 mb-2 text-xs font-medium rounded-full bg-primary/10 text-primary">
            <TrendingUp size={14} className="mr-1" /> 실시간 시장 분석
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            SPAM | Stock Predict AI LLM
          </h1>

          <p className="max-w-2xl mx-auto text-muted-foreground text-base md:text-lg">
            최신 LLM 모델과 고급 알고리즘을 통해 시장 데이터를 분석하고 맞춤형
            투자 인사이트를 제공합니다.
          </p>

          {/* 핵심 기능 아이콘 */}
          <div className="flex justify-center gap-6 py-4">
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-muted mb-2">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">티커 검색</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-muted mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">시그널 분석</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-muted mb-2">
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">뉴스 추천</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-muted mb-2">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium">AI 추천</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
