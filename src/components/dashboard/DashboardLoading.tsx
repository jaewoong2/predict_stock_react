import { CardSkeleton, CarouselSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <section className="relative w-full overflow-hidden border-b py-16 md:py-24">
        <div className="from-background via-background/95 to-primary/10 absolute inset-0 z-0 bg-gradient-to-br" />
        <div className="relative z-10 container mx-auto max-w-5xl text-center space-y-6">
          <div className="bg-primary/10 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="mx-auto h-12 w-1/2 md:h-16" />
          <Skeleton className="mx-auto h-6 w-2/3" />
        </div>
      </section>
      <div className="mx-auto max-w-[1500px] space-y-4 p-4 md:p-8">
        <div className="mb-4 grid grid-cols-[3fr_4fr_4fr] gap-4 max-lg:grid-cols-1">
          <CardSkeleton titleHeight={6} contentHeight={24} />
          <CardSkeleton titleHeight={6} contentHeight={24} />
          <CardSkeleton titleHeight={6} contentHeight={24} />
        </div>
        <CarouselSkeleton itemCount={10} />
      </div>
    </div>
  );
}
