import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => (
  <div className="md:grid md:grid-cols-12">
    <div className="md:col-span-7 p-4">
      <Skeleton className="h-[200px] md:h-full w-full" />
    </div>
    <PostCommentSkeleton />
  </div>
);

export default PostSkeleton;

export const PostCommentSkeleton = () => {
  return (
    <div className="md:col-span-5 p-4 space-y-4">
      <div className="flex gap-x-4">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="w-full" />
      </div>
      <Separator />
      <div className="space-y-8">
        <div className="flex gap-x-4">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="w-full" />
        </div>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex gap-x-4 max-w-[300px]">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-full h-[20px]" />
              <Skeleton className="w-full h-[5px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
