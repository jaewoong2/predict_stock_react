import { ColumnDef } from "@tanstack/react-table";
import { SignalData } from "@/types/signal";
import { SignalDataTable } from "./SignalDataTable";
import { PropsWithChildren } from "react";

interface SignalListWrapperProps {
  submittedDate: string;
  columns: ColumnDef<SignalData, unknown>[];
  data: SignalData[];
  onRowClick: (signal: SignalData) => void;
  isLoading: boolean;
  pageIndex?: number; // 외부에서 제어할 페이지 인덱스 (0-based)
  onPageIndexChange?: (pageIndex: number) => void; // 페이지 인덱스 변경 시 호출될 콜백
}

export function SignalListWrapper({
  columns,
  data,
  onRowClick,
  isLoading,
  children,
  pageIndex,
  onPageIndexChange,
}: PropsWithChildren<SignalListWrapperProps>) {
  return (
    <div className="mb-8">
      {children}
      <SignalDataTable
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        isLoading={isLoading}
        pageIndex={pageIndex} // 외부에서 제어할 페이지 인덱스
        onPageIndexChange={onPageIndexChange} // 페이지 인덱스 변경 시 호출될 콜백
      />
    </div>
  );
}
