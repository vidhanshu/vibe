import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const FeedListSkeleton = () => {
  return (
    <div className="space-y-10">
      {Array.from({ length: 4 }).map((_, idx) => (
        <FeedPostCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default FeedListSkeleton;

const FeedPostCardSkeleton = () => {
  return (
    <div className="space-y-4 max-w-[29rem] mx-auto">
      {/* header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="w-[100px] h-6" />
        </div>
        <Skeleton className="size-6 rounded-full" />
      </div>
      <Skeleton className="h-[578px]" />
      {/* footer*/}
      <div className="space-y-2">
        <div className="flex items-center gap-x-4">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="size-6 rounded-full" />
        </div>
        <Skeleton className="w-[100px] h-4" />
        <Skeleton className="w-[150px] h-4" />
        <Skeleton className="w-full h-6" />
      </div>
    </div>
  );
};
