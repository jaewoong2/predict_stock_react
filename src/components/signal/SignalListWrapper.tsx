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
}

export function SignalListWrapper({
  columns,
  data,
  onRowClick,
  isLoading,
  children,
}: PropsWithChildren<SignalListWrapperProps>) {
  return (
    <div className="mb-8">
      {children}
      <SignalDataTable
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        isLoading={isLoading}
      />
    </div>
  );
}
