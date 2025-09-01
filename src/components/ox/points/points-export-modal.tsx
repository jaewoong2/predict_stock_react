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
      // TODO: 실제 내보내기 API 호출
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 임시 지연

      // 파일 다운로드 시뮬레이션
      const blob = new Blob(["포인트 내보내기 데이터"], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `points-export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      onOpenChange(false);
    } catch (error) {
      console.error("내보내기 실패:", error);
    } finally {
      setIsExporting(false);
    }
  };

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
