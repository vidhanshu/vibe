"use client";

import Button from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import CreatePostModal from "@/src/common/components/modals/create-post-modal/create-post-modal";
import ViewPostModal from "@/src/common/components/modals/view-post-modal";
import useInfinite from "@/src/common/hooks/use-infinite";
import useIsMobile from "@/src/common/hooks/use-is-mobile";
import FeedPostViewDrawer from "@/src/feed/components/feed-post-view-drawer";
import { getExplorePosts } from "@/src/posts/actions/posts-actions";
import { NSPost } from "@/src/posts/types";
import NoContent from "@/src/users/components/no-content";
import { FileVideo, Images, Loader2, Play, Plus } from "lucide-react";
import Image from "next/image";
import { Suspense, useMemo, useState } from "react";

const ExplorePage = () => {
  const [viewPostId, setViewPostId] = useState<string | null>(null);
  const {
    data,
    isFetchingNextPage,
    isFetching: isLoading,
    ref,
  } = useInfinite({
    queryKey: ["explore"],
    fetcher: (val: { page: number }) => getExplorePosts({ ...val }),
  });

  const allData = useMemo(() => {
    return data.map((data) => data.items).flat() as NSPost.Post[];
  }, [data]);

  const isMobile = useIsMobile();
  return (
    <div className="max-w-4xl mx-auto py-12 min-h-screen">
      <div
        className={cn({
          "flex items-center justify-center h-[50vh]": allData.length === 0,
          "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-2":
            allData.length !== 0 || isLoading,
        })}
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-80" />
          ))
        ) : allData.length === 0 ? (
          <NoContent
            iconClassName="size-8"
            iconContainerClassName="size-16"
            title="No posts to explore"
            subtitle="Be the first one to post on vibe 😉!"
          >
            <CreatePostModal asChild>
              <Button
                size="sm"
                className="mt-2 w-fit"
                containerProps={{ className: "gap-x-1" }}
                endContent={<Plus className="size-5" />}
              >
                Create post
              </Button>
            </CreatePostModal>
          </NoContent>
        ) : (
          allData.map((post) => {
            const image = post.medias.find(
              ({ mediaType }) => mediaType === "IMAGE"
            );
            const video = post.medias.find(
              ({ mediaType }) => mediaType === "VIDEO"
            );
            return (
              <button
                key={post.id}
                onClick={() => setViewPostId(post.id)}
                className="relative border"
              >
                {image ? (
                  <Image
                    quality={30}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    alt={post.title}
                    src={image?.url}
                  />
                ) : (
                  <video
                    className="w-full h-full object-cover"
                    src={video?.url}
                  />
                )}
                {image ? (
                  <Images className="absolute top-2 right-2 size-6" />
                ) : (
                  <>
                    <FileVideo className="absolute top-2 right-2 size-6" />
                    <Play className="absolute m-auto inset-0 fill-white size-10 hover:scale-110" />
                  </>
                )}
              </button>
            );
          })
        )}
      </div>
      <div ref={ref} />

      {isFetchingNextPage && (
        <Loader2 className="size-6 mx-auto animate-spin" />
      )}

      {isMobile ? (
        <FeedPostViewDrawer
          postId={viewPostId}
          cancelView={() => setViewPostId(null)}
        />
      ) : (
        <Suspense>
          <ViewPostModal
            open={!!viewPostId}
            postId={viewPostId ?? ""}
            setOpen={() => setViewPostId(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ExplorePage;
