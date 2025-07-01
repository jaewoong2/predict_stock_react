import { CardSkeleton, CarouselSkeleton } from "@/components/ui/skeletons";

export default function DashboardLoading() {
  return (
    <div>
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
