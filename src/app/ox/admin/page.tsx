"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RewardStatusChip } from "@/components/ox/rewards/RewardStatusChip";
import { RewardCatalogGrid } from "@/components/ox/rewards/RewardCatalogGrid";
import { useRewardCatalog } from "@/hooks/useRewards";
import { useUserList } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AdminPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            관리자
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            리워드/사용자/포인트 관리 (초안)
          </p>
        </div>

        <Tabs defaultValue="rewards">
          <TabsList>
            <TabsTrigger value="rewards">리워드</TabsTrigger>
            <TabsTrigger value="users">사용자</TabsTrigger>
            <TabsTrigger value="points">포인트</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="mt-4">
            <AdminRewardsTab />
          </TabsContent>
          <TabsContent value="users" className="mt-4">
            <AdminUsersTab />
          </TabsContent>
          <TabsContent value="points" className="mt-4">
            <AdminPointsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}

function AdminRewardsTab() {
  // 관리자 뷰는 비가용 포함
  const { data, isLoading, error } = useRewardCatalog(false);
  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>리워드 카탈로그 (관리)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              불러오는 중...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-600 dark:text-red-400">
              카탈로그 로딩 실패
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map((i) => (
                <Card key={i.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="truncate text-base" title={i.name}>
                      {i.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {i.description}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">
                        {i.points_cost.toLocaleString()} P
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        재고 {i.stock_quantity ?? "-"}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      {i.is_available ? (
                        <span className="text-green-600 dark:text-green-400">
                          노출중
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          비노출
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* TODO: 생성/수정/재고 조정 모달 스캐폴딩 */}
    </div>
  );
}

function AdminUsersTab() {
  const { data, isLoading, error } = useUserList({ limit: 20, offset: 0 });
  const users = data?.users ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>사용자 목록</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600 dark:text-red-400">
            목록을 불러오지 못했습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50 text-left dark:bg-gray-900">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">닉네임</th>
                  <th className="px-3 py-2">제공자</th>
                  <th className="px-3 py-2">가입일</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="px-3 py-2">{u.id}</td>
                    <td className="px-3 py-2">{u.nickname}</td>
                    <td className="px-3 py-2">{u.auth_provider}</td>
                    <td className="px-3 py-2">
                      {new Date(u.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminPointsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>포인트 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          포인트 조정/원장 열람 등은 API 준비 후 연결 예정입니다.
        </div>
      </CardContent>
    </Card>
  );
}
