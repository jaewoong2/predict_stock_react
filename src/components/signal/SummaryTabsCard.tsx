import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { WeeklyActionCountCard } from "./WeeklyActionCountCard";
import { WeeklyPriceMovementCard } from "./WeeklyPriceMovementCard";
import RecommendationByAiCard from "./RecommendationByAICard";
import RecommendationCard from "./RecommendationCard";
import { useSignalSearchParams } from "@/hooks/useSignalSearchParams";

const SummaryTabsCard = () => {
  const { date } = useSignalSearchParams();

  return (
    <Tabs defaultValue="weekly" className="w-full">
      <Card className="shadow-none">
        <CardHeader className="p-0">
          <TabsList className="w-full">
            <TabsTrigger value="weekly" className="flex-1">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="today" className="flex-1">
              Today
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="pt-4">
          <TabsContent value="weekly" className="outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WeeklyActionCountCard
                title="Weekly Top Buy Signals"
                params={{
                  action: "Buy",
                  reference_date: date ?? undefined,
                }}
              />
              <WeeklyPriceMovementCard
                title="Weekly Top Up Price Movements"
                params={{
                  direction: "up",
                  reference_date: date ?? undefined,
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="today" className="outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecommendationByAiCard title="Today Ai`s Recommendation" />
              <RecommendationCard
                title="Today News Recommendation"
                recommendation="Buy"
                badgeColor="bg-green-100 text-green-800"
              />
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default SummaryTabsCard;
