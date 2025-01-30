"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ProfileHeaderSkeleton = () => {
  return (
    <>
      <div className="flex gap-x-16 max-w-[700px] mx-auto">
        <Skeleton className="size-40 rounded-full" />
        <div className="flex-1 flex flex-col justify-between py-2">
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
