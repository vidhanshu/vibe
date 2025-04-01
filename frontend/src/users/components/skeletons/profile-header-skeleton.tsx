"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ProfileHeaderSkeleton = () => {
  return (
    <>
      <div className="flex gap-x-16 max-w-[700px] mx-auto md:flex-row flex-col px-4 md:px-0">
        <Skeleton className="size-28 md:size-40 rounded-full" />
        <div className="flex-1 flex flex-col justify-between py-2 gap-4 md:gap-0">
          <div className="flex justify-between">
            <Skeleton className="w-[100px] h-[30px] rounded-md" />
            <Skeleton className="w-[100px] h-[30px] rounded-md" />
            <Skeleton className="w-[100px] h-[30px] rounded-md" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="w-[100px] h-[30px] rounded-md" />
            <Skeleton className="w-[100px] h-[30px] rounded-md" />
            <Skeleton className="w-[100px] h-[30px] rounded-md" />
          </div>
          <Skeleton className="w-[100px] h-[10px] rounded-full" />
        </div>
      </div>
      <div className="flex gap-x-4 justify-center">
        <Skeleton className="w-[100px] h-[30px] rounded-md" />
        <Skeleton className="w-[100px] h-[30px] rounded-md" />
        <Skeleton className="w-[100px] h-[30px] rounded-md" />
      </div>
    </>
  );
};

export default ProfileHeaderSkeleton;
