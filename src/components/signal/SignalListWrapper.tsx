import { ColumnDef } from "@tanstack/react-table";
import { SignalData } from "@/types/signal";
import { SignalDataTable } from "./SignalDataTable";

interface SignalListWrapperProps {
  submittedDate: string;
  columns: ColumnDef<SignalData, unknown>[];
  data: SignalData[];
  onRowClick: (signal: SignalData) => void;
  isLoading: boolean;
  globalFilter: string;
  onGlobalFilterChange: (v: string) => void;
}

export function SignalListWrapper({
  submittedDate,
  columns,
  data,
  onRowClick,
  isLoading,
  globalFilter,
  onGlobalFilterChange,
}: SignalListWrapperProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-3">시그널 목록 ({submittedDate})</h2>
      <SignalDataTable
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        isLoading={isLoading}
        globalFilter={globalFilter}
        onGlobalFilterChange={onGlobalFilterChange}
      />
    </div>
  );
}
