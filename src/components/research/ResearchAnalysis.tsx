"use client";

import { useResearch } from "@/hooks/useResearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Factory,
  Cpu,
  DollarSign,
} from "lucide-react";
import { ResearchItem, LeadingStock, CompanyInfo } from "@/types/research";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";

const ResearchItemCard = ({ item }: { item: ResearchItem }) => (
  <Card className="border shadow-none">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
        <Badge variant="outline" className="ml-2">
          {item.event_type}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">{item.date}</p>
    </CardHeader>
    <CardContent>
      <p className="mb-3 text-sm">{item.summary}</p>
      <div className="flex flex-wrap gap-1">
        {item.entities.map((entity, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {entity}
          </Badge>
        ))}
      </div>
      <p className="text-muted-foreground mt-2 text-xs">출처: {item.source}</p>
    </CardContent>
  </Card>
);

const LeadingStockCard = ({ stock }: { stock: LeadingStock }) => (
  <Card className="border shadow-none">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">
            {stock.stock_metrics.ticker}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {stock.stock_metrics.company_name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">
            ${stock.stock_metrics.current_price}
          </p>
          <p className="text-muted-foreground text-sm">
            목표: ${stock.target_price}
          </p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-muted-foreground text-xs">매출 성장률</p>
          <p className="font-semibold">
            {stock.stock_metrics.revenue_growth_rate}%
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">RS 강도</p>
          <p className="font-semibold">{stock.stock_metrics.rs_strength}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">시가총액</p>
          <p className="font-semibold">
            ${(stock.stock_metrics.market_cap / 1000).toFixed(1)}B
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">추천</p>
          <Badge
            variant={stock.recommendation === "Buy" ? "default" : "secondary"}
            className="text-xs"
          >
            {stock.recommendation}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium">
            분석 요약
          </p>
          <p className="text-sm">{stock.analysis_summary}</p>
        </div>

        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium">
            성장 잠재력
          </p>
          <p className="text-sm">{stock.growth_potential}</p>
        </div>

        <div>
          <p className="text-muted-foreground mb-1 text-xs font-medium">
            위험 요소
          </p>
          <ul className="space-y-1 text-sm">
            {stock.risk_factors.map((risk, index) => (
              <li key={index} className="flex items-start">
                <span className="text-destructive mr-2">•</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SectorCard = ({
  title,
  companies,
  icon: Icon,
}: {
  title: string;
  companies: CompanyInfo[];
  icon: any;
}) => (
  <Card className="border shadow-none">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center text-lg">
        <Icon className="mr-2 h-5 w-5" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {companies.map((company, index) => (
          <div key={index} className="border-primary/20 border-l-2 pl-3">
            <h4 className="mb-1 text-sm font-medium">{company.sector}</h4>
            <p className="text-muted-foreground mb-2 text-sm">
              {company.reason}
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="border shadow-none">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default function ResearchAnalysis() {
  const { date } = useSignalSearchParams();
  const { data, isLoading, error } = useResearch({
    target_date: date ?? new Date().toISOString().split("T")[0],
    limit: 10,
    sort_by: "date",
    sort_order: "desc",
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert className="shadow-none">
        <p>이슈 기반 분석 데이터를 불러오는 중 오류가 발생했습니다.</p>
      </Alert>
    );
  }

  if (!data || !data.analyses || data.analyses.length === 0) {
    return (
      <Alert className="flex w-full items-center justify-center shadow-none">
        <p>이슈 기반 분석 데이터가 없습니다.</p>
      </Alert>
    );
  }

  // 첫 번째 분석 데이터를 사용
  const firstAnalysis = data.analyses[0];
  const { research_results, sector_analysis, leading_stocks } =
    firstAnalysis.value;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">이슈 기반 분석</h1>
          <p className="text-muted-foreground text-sm">
            총 {data.total_count}개 중 {data.filtered_count}개 결과
            {data.analyses.length > 1 && ` (첫 번째 분석 결과 표시)`}
          </p>
        </div>
        <Badge variant="outline">{data.actual_date}</Badge>
      </div>

      <Tabs defaultValue="research" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="research">연구 결과</TabsTrigger>
          <TabsTrigger value="sectors">섹터 분석</TabsTrigger>
          <TabsTrigger value="stocks">주요 종목</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-4">
          <div className="grid gap-4">
            {research_results?.research_items?.map(
              (item: ResearchItem, index: number) => (
                <ResearchItemCard key={index} item={item} />
              ),
            )}
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectorCard
              title="주요 수혜 업체"
              companies={sector_analysis.analysis.primary_beneficiaries}
              icon={TrendingUp}
            />
            <SectorCard
              title="공급망 수혜 업체"
              companies={sector_analysis.analysis.supply_chain_beneficiaries}
              icon={Factory}
            />
            <SectorCard
              title="병목 해결 수혜 업체"
              companies={
                sector_analysis.analysis.bottleneck_solution_beneficiaries
              }
              icon={Cpu}
            />
            <SectorCard
              title="인프라 수혜 업체"
              companies={sector_analysis.analysis.infrastructure_beneficiaries}
              icon={Building2}
            />
          </div>
        </TabsContent>

        <TabsContent value="stocks" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {leading_stocks.leading_stocks.map((stock, index) => (
              <LeadingStockCard key={index} stock={stock} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
