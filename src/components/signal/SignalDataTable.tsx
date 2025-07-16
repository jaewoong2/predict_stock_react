"use client";
import { useState, useEffect } from "react";
import { useLocalPagination } from "@/hooks/useLocalPagination";
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
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignalData } from "../../types/signal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TableSkeleton } from "../ui/skeletons";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  totalItems?: number;
  totalPages?: number;
  storageKey?: string;
}

export function SignalDataTable<TData extends SignalData, TValue>({
  columns,
  data,
  onRowClick,
  isLoading,
  storageKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { desc: true, id: "signal.favorite" },
    { desc: true, id: "take_profit_buy" },
  ]);
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: unknown }[]
  >([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { pageSize, setPage, setPageSize, page } = useLocalPagination({
    storageKey: storageKey || "signal_table_pagination",
    defaultPage: 1,
    defaultPageSize: 20,
  });

  function onPaginationChange(newPage: number, newPageSize: number) {
    setPageSize(newPageSize);
    setPage(newPage);
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page,
        pageSize,
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

  // 페이지 크기가 변경될 때마다 테이블의 페이지 크기도 동기화
  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  if (isLoading) {
    return <TableSkeleton columnCount={columns.length} rowCount={pageSize} />;
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
                            header.getContext(),
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
                  className="hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
        <div className="text-muted-foreground flex w-full items-center justify-start gap-4 text-sm">
          <span>
            {(() => {
              const tablePageSize = table.getState().pagination.pageSize || 0;
              const tablePageIndex = table.getState().pagination.pageIndex || 0;
              const totalData = data.length;
              const currentStart = Math.min(
                tablePageSize * tablePageIndex + 1,
                totalData,
              );
              const currentEnd = Math.min(
                tablePageSize * (tablePageIndex + 1),
                totalData,
              );

              if (totalData === 0) {
                return "0 / 0";
              }

              return `${currentStart}-${currentEnd} / ${totalData}`;
            })()}
          </span>
          <div className="flex items-center py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {activePagination.pageSize}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {[10, 20, 30, 50].map((size) => (
                  <DropdownMenuCheckboxItem
                    key={size}
                    className="capitalize"
                    checked={activePagination.pageSize === size}
                    onCheckedChange={() => {
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
              Math.max(0, activePagination.pageIndex - 1),
              activePagination.pageSize,
            )
          }
          disabled={
            paginationInfo
              ? !paginationInfo.has_previous
              : !table.getCanPreviousPage()
          }
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
              activePagination.pageIndex + 1,
              activePagination.pageSize,
            )
          }
          disabled={
            paginationInfo ? !paginationInfo.has_next : !table.getCanNextPage()
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
