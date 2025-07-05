import { MarketOverview } from "@/types/market";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";

interface MarketOverviewCardProps {
  data: MarketOverview;
  date: string;
}

export function MarketOverviewCard({ data, date }: MarketOverviewCardProps) {
  return (
    <Card className="h-fit shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-medium">시장 개요</CardTitle>
          <Badge variant="outline" className="font-normal">
            {date}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{data.summary}</p>

        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-sm font-medium">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            주요 이벤트
          </h4>
          <Separator className="my-2" />
          <ul className="space-y-2">
            {data.major_catalysts.map((catalyst, idx) => (
              <li key={idx} className="flex gap-2 text-sm">
                <span className="text-primary shrink-0 font-medium">•</span>
                <span>{catalyst}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
