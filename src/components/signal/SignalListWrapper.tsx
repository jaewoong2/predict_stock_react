"use client";
import React, { PropsWithChildren } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SignalData } from "@/types/signal";
import { SignalDataTable } from "./SignalDataTable";

interface SignalListWrapperProps {
  columns: ColumnDef<SignalData, unknown>[];
  data: SignalData[];
  onRowClick: (signal: SignalData) => void;
  isLoading?: boolean;
  totalItems?: number;
  totalPages?: number;
  storageKey?: string;
}

export const SignalListWrapper = React.memo(
  ({
    columns,
    data,
    onRowClick,
    isLoading = false,
    totalItems = 0,
    totalPages = 0,
    storageKey,
    children,
  }: PropsWithChildren<SignalListWrapperProps>) => {
    return (
      <div className="mb-8">
        {children}
        <SignalDataTable
          columns={columns}
          data={data}
          onRowClick={onRowClick}
          isLoading={isLoading}
          totalItems={totalItems}
          totalPages={totalPages}
          storageKey={storageKey}
        />
      </div>
    );
  },
);

SignalListWrapper.displayName = "SignalListWrapper";
