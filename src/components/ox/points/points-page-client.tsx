"use client";

import { useState } from "react";
import { PointsLedgerList } from "./points-ledger-list";
import { PointsExportModal } from "./points-export-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Filter } from "lucide-react";

export function PointsPageClient() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  return (
    <div className="space-y-6">
      {/* 액션 버튼들 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>포인트 관리</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportModal(true)}
              >
                <Download className="mr-2 h-4 w-4" />
                내보내기
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              전체
            </Button>
            <Button
              variant={filterType === "earned" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("earned")}
            >
              획득
            </Button>
            <Button
              variant={filterType === "spent" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("spent")}
            >
              사용
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 포인트 거래 내역 */}
      <PointsLedgerList filterType={filterType} />

      {/* 포인트 내보내기 모달 */}
      <PointsExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
      />
    </div>
  );
}
