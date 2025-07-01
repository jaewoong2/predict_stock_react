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
    <Tabs defaultValue={defaultValue} className="h-full w-full">
      <Card className="h-full gap-2 shadow-none">
        <CardHeader className="px-6 py-0">
          <TabsList className="flex w-fit max-w-[450px] items-center justify-center text-wrap whitespace-pre-wrap">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>
        <CardContent className="h-full w-full py-0">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="h-full outline-none"
            >
              <div className="h-full flex-1">{tab.component}</div>
            </TabsContent>
          ))}
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default SummaryTabsCard;
