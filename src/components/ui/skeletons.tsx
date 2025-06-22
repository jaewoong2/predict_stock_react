import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropsWithChildren } from "react";

interface CardSkeletonProps {
  titleHeight?: number;
  contentHeight?: number;
  className?: string;
  cardClassName?: string;
  withBadge?: boolean;
}

interface TableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
}

interface BadgeGroupSkeletonProps {
  count?: number;
  className?: string;
}

interface CarouselSkeletonProps {
  itemCount?: number;
}

export const CardSkeleton = ({
  children,
  titleHeight = 24,
  contentHeight = 100,
  className = "",
  cardClassName = "",
  withBadge = false,
}: PropsWithChildren<CardSkeletonProps>) => {
  return (
    <Card className={`shadow-none ${cardClassName}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium flex items-center justify-between w-full">
          <Skeleton className={`h-${titleHeight} w-1/2 ${className}`} />
          {withBadge && <Skeleton className="h-6 w-16 rounded-full" />}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${className}`}>
        <Skeleton className={`h-${contentHeight} w-full`} />
        {children}
      </CardContent>
    </Card>
  );
};

export const TableSkeleton = ({
  columnCount = 5,
  rowCount = 5,
}: TableSkeletonProps) => {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array(columnCount)
                .fill(null)
                .map((_, index) => (
                  <TableHead key={`header-${index}`}>
                    <Skeleton className="h-8 w-full" />
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(rowCount)
              .fill(null)
              .map((_, rowIndex) => (
                <TableRow key={`row-${rowIndex}`}>
                  {Array(columnCount)
                    .fill(null)
                    .map((_, colIndex) => (
                      <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-8 w-20" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>

      <div className="pt-2">
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
};

export const BadgeGroupSkeleton = ({
  count = 10,
  className = "",
}: BadgeGroupSkeletonProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={`badge-${index}`} className="h-6 w-16 rounded-full" />
        ))}
    </div>
  );
};

export const CarouselSkeleton = ({ itemCount = 3 }: CarouselSkeletonProps) => {
  return (
    <div className="flex overflow-x-auto space-x-4 snap-x h-full">
      {Array(itemCount)
        .fill(null)
        .map((_, index) => (
          <div
            key={`carousel-item-${index}`}
            className="min-w-[250px] snap-start bg-card rounded-md p-4 border flex flex-col justify-between"
          >
            <div>
              <Skeleton className="h-6 w-16 mb-2 rounded-full" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-3 w-24 mt-2" />
          </div>
        ))}
    </div>
  );
};
