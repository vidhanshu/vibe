"use client";

import Button from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/src/auth/components/user-avatar";
import ViewPostModal from "@/src/common/components/modals/view-post-modal";
import PostFooter from "@/src/common/components/modals/view-post-modal/post-footer";
import PostMediaCarousel from "@/src/common/components/modals/view-post-modal/post-media-carousel";
import useInfinite from "@/src/common/hooks/use-infinite";
import useSessionStore from "@/src/common/stores/session-store";
import { getShortRelativeTime } from "@/src/common/utils/dayjs";
import { getPosts } from "@/src/posts/actions/posts-actions";
import usePost from "@/src/posts/hooks/use-post";
import { NSPost } from "@/src/posts/types";
import NoContent from "@/src/users/components/no-content";
import { CircleCheckBig, Ellipsis, Loader } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FeedListSkeleton from "./feed-list-skeleton";

const FeedList = () => {
  const { data, isFetchingNextPage, hasNextPage, isLoading, ref } = useInfinite(
    {
      fetcher: getPosts,
      queryKey: ["posts"],
    }
  );

  const paginatedResponse = data?.map((data) => data.items).flat();

  return (
    <div className="space-y-6">
      <FeedStatuses />
      {isLoading ? (
        <FeedListSkeleton />
      ) : (
        <div className="space-y-6 max-w-[29rem] mx-auto">
          {paginatedResponse?.map((post: NSPost.DetailedPost, idx: number) => {
            return (
              <React.Fragment key={post.id}>
                {idx > 0 && <Separator className="opacity-70" />}
                <FeedPostCard key={post.id} {...post} />
              </React.Fragment>
            );
          })}
          <div ref={ref} />
          {isFetchingNextPage && (
            <Loader className="mx-auto size-6 animate-spin" />
          )}
          {!hasNextPage && (
            <NoContent
              icon={CircleCheckBig}
              iconContainerClassName="border-none size-auto p-0"
              iconClassName="size-8"
              title="All caught up"
              titleClassName="text-2xl"
              containerClassName="gap-2"
              subtitle="No more posts to show"
              subtitleClassName="text-muted-foreground text-sm"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FeedList;

const FeedStatuses = () => {
  return <div>Statuses</div>;
};

const FeedPostCard = (detailedPost: NSPost.DetailedPost) => {
  const { id, createdAt, medias, title, user } = detailedPost;
  // const router = useRouter();
  const [open, setOpen] = useState(false);
  const currentUserId = useSessionStore((select) => select.user?.id);
  const [comment, setComment] = useState("");
  // const sp = useSearchParams();
  // const postId = sp.get("postId");
  const [liked, setLiked] = useState(false);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);

  const { handleComment, handleLike, handleUpdateComment } = usePost({
    postId: id,
    comment,
    editCommentId,
    setComment,
    setEditCommentId,
  });

  useEffect(() => {
    if (!currentUserId) return;
    if (detailedPost?.likes?.some(({ userId }) => userId === currentUserId))
      setLiked(true);
  }, [detailedPost, currentUserId]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <Link
              href={`/user/${user.username}`}
              className="flex gap-x-2 items-center"
            >
              <UserAvatar
                url={user?.profilePhoto?.url}
                username={user?.username}
              />
              {user?.username}
            </Link>
            <p className="font-bold text-muted-foreground text-sm">
              {" "}
              . {getShortRelativeTime(createdAt)}
            </p>
          </div>
          <Button size="icon-xs" variant="ghost">
            <Ellipsis className="size-4" />
          </Button>
        </div>
        <div className="border h-[585px] flex items-center justify-center">
          <PostMediaCarousel
            containerClassName="flex-1"
            imageClassName="w-full max-h-[585px]"
            videoClassName="max-h-[585px] w-auto max-w-sm"
            title={title}
            medias={medias}
          />
        </div>
        {detailedPost && (
          <PostFooter
            comment={comment}
            autoFocusComment={false}
            setComment={setComment}
            editCommentId={editCommentId}
            handleComment={handleComment}
            handleLike={handleLike}
            handleUpdateComment={handleUpdateComment}
            liked={liked}
            setLiked={setLiked}
            post={detailedPost}
            variant="feed"
            onCommentClick={() => {
              setOpen(true);
            }}
          />
        )}
      </div>
      {open && (
        <ViewPostModal
          skipPostFetch
          open={open}
          setOpen={setOpen}
          postId={id}
        />
      )}
    </>
  );
};
