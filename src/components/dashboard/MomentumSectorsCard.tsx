"use client";
import { MomentumSector, ThemeStock } from "@/types/market";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  TrendingUp,
  AlertTriangle,
  LineChart,
  ExternalLink,
} from "lucide-react";

interface MomentumSectorsCardProps {
  sectors: MomentumSector[];
  defaultValue: string;
}

export function MomentumSectorsCard({
  sectors,
  defaultValue,
}: MomentumSectorsCardProps) {
  return (
    <Card className="mb-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="font-medium">상위 모멘텀 섹터</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultValue}>
          <TabsList className="mb-4 w-full max-md:flex max-md:flex-col">
            {sectors.map((sector) => (
              <TabsTrigger
                key={sector.sector_ranking}
                value={sector.sector}
                className="flex w-full items-center gap-1.5"
              >
                <span className="hidden sm:inline">
                  {sector.sector_ranking}.
                </span>
                <span>{sector.sector}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {sectors.map((sector) => (
            <TabsContent
              key={sector.sector_ranking}
              value={sector.sector}
              className="space-y-4"
            >
              <div className="space-y-3 pt-4">
                <h4 className="flex items-center gap-1.5 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  섹터 모멘텀 분석
                </h4>
                <p className="text-muted-foreground text-sm">{sector.reason}</p>
              </div>

              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50 text-red-800"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-sm font-medium">
                  위험 요소
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {sector.risk_factor}
                </AlertDescription>
              </Alert>

              {sector.themes.map((theme, themeIdx) => (
                <div key={themeIdx} className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-1.5 text-sm font-medium">
                      <LineChart className="h-4 w-4 text-blue-500" />
                      주요 테마: {theme.key_theme}
                    </h4>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex gap-2 max-md:flex-col md:flex-row">
                    {theme.stocks.map((stock) => (
                      <StockCard key={stock.ticker} stock={stock} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function StockCard({ stock }: { stock: ThemeStock }) {
  const priceChange = stock.pre_market_change;
  const isPositive = priceChange.includes("+");

  return (
    <Card className="flex-1 overflow-hidden shadow-none transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h4 className="font-medium">{stock.ticker}</h4>
              <p className="text-muted-foreground text-xs">{stock.name}</p>
            </div>
          </div>
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={
              isPositive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""
            }
          >
            {stock.pre_market_change}
          </Badge>
        </div>

        <div className="mt-3 space-y-2">
          <div className="bg-muted rounded-md p-2">
            <div className="flex items-center gap-1 text-xs font-medium">
              <ExternalLink className="h-3 w-3" />
              {stock.key_news.source}
            </div>
            <h5 className="text-sm font-medium">{stock.key_news.headline}</h5>
            <p className="text-muted-foreground text-xs">
              {stock.key_news.summary}
            </p>
          </div>

          <div className="rounded-md border p-2">
            <h5 className="text-xs font-medium">단기 전략</h5>
            <p className="text-xs">{stock.short_term_strategy}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
