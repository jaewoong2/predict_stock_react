"use client";

import { useState } from "react";
import { PointsLedgerList } from "./points-ledger-list";
import { PointsExportModal } from "./points-export-modal";
import { TossButton } from "@/components/ui/toss-button";
import { TossCard, TossCardContent, TossCardHeader, TossCardTitle } from "@/components/ui/toss-card";
import { Download, History } from "lucide-react";
import { cn } from "@/lib/utils";

export function PointsPageClient() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const filters = [
    { id: "all", label: "전체" },
    { id: "earned", label: "획득" },
    { id: "spent", label: "사용" }
  ];

  return (
    <div className="space-y-6">
      {/* 액션 버튼들 */}
      <TossCard padding="lg">
        <TossCardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-600" />
              <TossCardTitle>거래 내역</TossCardTitle>
            </div>
            <TossButton
              variant="ghost"
              size="sm"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="h-4 w-4" />
              내보내기
            </TossButton>
          </div>
        </TossCardHeader>
        <TossCardContent>
          {/* Filter Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                  filterType === filter.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </TossCardContent>
      </TossCard>

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
