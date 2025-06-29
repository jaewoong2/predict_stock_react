"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
  tabs: {
    value: string;
    label: string;
    component: React.ReactNode;
  }[];
};

const SummaryTabsCard = ({ tabs }: Props) => {
  const defaultValue = tabs.length > 0 ? tabs[0].value : "";

  return (
    <Tabs defaultValue={defaultValue} className="w-full h-full">
      <Card className="shadow-none gap-2 h-full">
        <CardHeader className="px-6 py-0">
          <TabsList className="w-fit max-w-[450px] flex items-center justify-center text-wrap whitespace-pre-wrap">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>
        <CardContent className="w-full py-0 h-full">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="outline-none h-full"
            >
              <div className="flex-1 h-full">{tab.component}</div>
            </TabsContent>
          ))}
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default SummaryTabsCard;
