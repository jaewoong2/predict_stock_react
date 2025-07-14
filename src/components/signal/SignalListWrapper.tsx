"use client";
import { ColumnDef } from "@tanstack/react-table";
import { SignalData } from "@/types/signal";
import { SignalDataTable } from "./SignalDataTable";
import { PropsWithChildren } from "react";

interface SignalListWrapperProps {
  submittedDate: string;
  columns: ColumnDef<SignalData, unknown>[];
  data: SignalData[];
  onRowClick: (signal: SignalData) => void;
  isLoading?: boolean;
  // 페이지네이션 상태 추가
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  paginationInfo?: import("@/types/signal").PaginationResponse;
  // 페이지네이션 변경 이벤트 핸들러 추가
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function SignalListWrapper({
  columns,
  data,
  onRowClick,
  isLoading,
  children,
  pagination,
  paginationInfo,
  onPaginationChange,
}: PropsWithChildren<SignalListWrapperProps>) {
  return (
    <div className="mb-8">
      {children}
      <SignalDataTable
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        isLoading={isLoading}
        pagination={pagination}
        paginationInfo={paginationInfo}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
}
