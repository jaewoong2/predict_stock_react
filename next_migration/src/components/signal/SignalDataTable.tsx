import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Shadcn UI 경로 확인
import { Button } from "@/components/ui/button"; // Shadcn UI 경로 확인
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Shadcn UI 경로 확인
import { SignalData } from "../../types/signal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TableSkeleton } from "../ui/skeletons";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void; // 행 클릭 시 콜백 함수
  isLoading?: boolean;
  // 페이지네이션 상태를 외부에서 주입받기 위한 props
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  // 페이지네이션 변경 이벤트 핸들러
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function SignalDataTable<TData extends SignalData, TValue>({
  columns,
  data,
  onRowClick,
  isLoading,
  pagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { desc: true, id: "signal.favorite" }, // 제출일 기준 내림차순 정렬
    { desc: true, id: "take_profit_buy" },
  ]); // 기본 정렬 상태 설정 (제출일 기준 내림차순)
  const [columnFilters, setColumnFilters] = React.useState<
    { id: string; value: unknown }[]
  >([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // 실제 사용할 페이지네이션 상태 (외부 또는 내부)
  const activePagination = pagination;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: activePagination.pageIndex,
        pageSize: activePagination.pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      // signal.ticker와 같이 중첩된 값에 접근하기 위한 처리
      if (columnId.includes(".")) {
        const keys = columnId.split(".");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let nestedValue = row.original as any;
        for (const key of keys) {
          if (
            nestedValue &&
            typeof nestedValue === "object" &&
            key in nestedValue
          ) {
            nestedValue = nestedValue[key];
          } else {
            nestedValue = undefined;
            break;
          }
        }
        return String(nestedValue)
          .toLowerCase()
          .includes(String(filterValue).toLowerCase());
      }
      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    },
  });

  if (isLoading) {
    return (
      <TableSkeleton
        columnCount={columns.length}
        rowCount={pagination.pageSize}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  데이터를 불러오는 중입니다...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row.original as TData);
                      table.resetRowSelection();
                      row.toggleSelected();
                    }
                  }}
                  className="cursor-pointer hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  표시할 데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex justify-start w-full items-center gap-4 text-sm text-muted-foreground">
          <span>
            {table.getState().pagination.pageSize *
              table.getState().pagination.pageIndex}{" "}
            / {table.getFilteredRowModel().rows.length}
          </span>
          <div className="flex items-center py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {table.getState().pagination.pageSize}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[10, 20, 30, 50].map((size) => (
                  <DropdownMenuCheckboxItem
                    key={size}
                    className="capitalize"
                    checked={table.getState().pagination.pageSize === size}
                    onCheckedChange={() => {
                      table.setPageSize(size);
                      if (onPaginationChange) {
                        onPaginationChange(0, size);
                      }
                    }}
                  >
                    {size}줄
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            onPaginationChange &&
            onPaginationChange(
              table.getState().pagination.pageIndex - 1,
              table.getState().pagination.pageSize
            )
          }
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4 transform" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            onPaginationChange &&
            onPaginationChange(
              table.getState().pagination.pageIndex + 1,
              table.getState().pagination.pageSize
            )
          }
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
