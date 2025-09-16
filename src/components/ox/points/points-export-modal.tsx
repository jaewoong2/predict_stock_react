"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Download, Calendar } from "lucide-react";
import { pointService } from "@/services/pointService";
import { PAGINATION_LIMITS } from "@/types/common";
import type { PointsLedgerEntry } from "@/types/points";

interface PointsExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PointsExportModal({
  open,
  onOpenChange,
}: PointsExportModalProps) {
  const [format, setFormat] = useState<string>("csv");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // 1) 원장 전체 페이지네이션 수집
      const limit = PAGINATION_LIMITS.POINTS_LEDGER.max; // 최대 100
      let offset = 0;
      let hasNext = true;
      const all: PointsLedgerEntry[] = [];

      while (hasNext) {
        const page = await pointService.getPointsLedger({ limit, offset });
        all.push(...page.entries);
        hasNext = page.has_next;
        offset += limit;
        // 안전장치: 과도한 루프 방지
        if (offset > 5000) break;
      }

      // 2) 기간 필터링 (선택적)
      const inRange = (e: PointsLedgerEntry) => {
        const ts = new Date(e.created_at).getTime();
        if (startDate && ts < startDate.setHours(0, 0, 0, 0)) return false;
        if (endDate && ts > endDate.setHours(23, 59, 59, 999)) return false;
        return true;
      };
      const filtered = all.filter(inRange);

      // 3) 포맷별 변환 (기본 CSV)
      const fileBase = `points-export-${new Date().toISOString().split("T")[0]}`;
      const csvHeaders = [
        "id",
        "transaction_type",
        "delta_points",
        "balance_after",
        "reason",
        "ref_id",
        "created_at",
      ];
      const csvRows = filtered.map((e) => [
        e.id,
        e.transaction_type,
        e.delta_points,
        e.balance_after,
        sanitizeCsvField(e.reason),
        e.ref_id ?? "",
        e.created_at,
      ]);

      let blob: Blob;
      let filename: string;
      if (format === "json") {
        blob = new Blob([JSON.stringify(filtered, null, 2)], {
          type: "application/json",
        });
        filename = `${fileBase}.json`;
      } else if (format === "excel") {
        // 간단하게 CSV로 저장하고 확장자만 xls로 제공 (클릭 열기 호환)
        const csv = [csvHeaders.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
        blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
        filename = `${fileBase}.xls`;
      } else {
        const csv = [csvHeaders.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
        blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
        filename = `${fileBase}.csv`;
      }

      // 4) 다운로드 트리거
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      onOpenChange(false);
    } catch (error) {
      console.error("내보내기 실패:", error);
    } finally {
      setIsExporting(false);
    }
  };

  function sanitizeCsvField(value: string) {
    // 따옴표/줄바꿈 이스케이프
    const v = value?.replace(/"/g, '""') ?? "";
    return `"${v}"`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            포인트 내보내기
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="format">파일 형식</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="파일 형식을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>기간 설정</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-500">시작일</Label>
                <DatePicker
                  date={startDate}
                  onDateChange={setStartDate}
                  // placeholder="시작일 선택"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">종료일</Label>
                <DatePicker
                  date={endDate}
                  onDateChange={setEndDate}
                  // placeholder="종료일 선택"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isExporting}
            >
              취소
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  내보내는 중...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  내보내기
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
