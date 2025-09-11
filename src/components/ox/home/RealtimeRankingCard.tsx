"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PopularStocksList } from "@/components/stocks/PopularStocksList";
import { format } from "date-fns";

export function RealtimeRankingCard() {
  const [tab, setTab] = useState("volume");
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <Card>
      <CardHeader>
        <CardTitle>실시간 차트</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="volume">거래량</TabsTrigger>
            <TabsTrigger value="popular">인기</TabsTrigger>
            <TabsTrigger value="watch">관심</TabsTrigger>
            <TabsTrigger value="etf">ETF</TabsTrigger>
          </TabsList>
          <TabsContent value="volume" className="mt-4">
            <PopularStocksList date={today} viewType="card" />
          </TabsContent>
          <TabsContent value="popular" className="mt-4">
            <PopularStocksList date={today} viewType="card" />
          </TabsContent>
          <TabsContent value="watch" className="mt-4">
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">관심목록을 준비 중입니다.</div>
          </TabsContent>
          <TabsContent value="etf" className="mt-4">
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">ETF 보기는 준비 중입니다.</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

