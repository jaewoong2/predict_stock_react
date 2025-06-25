import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="w-full py-10 md:py-16 bg-muted/50 border-b">
      <div className="container mx-auto max-w-5xl text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          AI 기반 주식 분석 대시보드
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          최신 LLM 모델을 활용해 시장 데이터를 분석하고 다양한 인사이트를 제공합니다.
        </p>
        <div className="pt-2">
          <Button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            지금 살펴보기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
