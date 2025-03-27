import Button from "@/components/ui/button";
import UserAvatar from "@/src/auth/components/user-avatar";
import useComments from "@/src/posts/hooks/use-comments";
import { NSPost } from "@/src/posts/types";
import NoContent from "@/src/users/components/no-content";
import { CircleCheckBig, Loader, MessageCircle, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import ShowMore from "../../show-more";
import Comment from "./comment";
import UserChip from "../../user-chip";
import Link from "next/link";

const PostComments = ({
  post,
  setOpen,
  setEditCommentId,
  comment,
  setComment,
  editCommentId,
  hideClose = false,
}: {
  post: NSPost.DetailedPost;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  editCommentId: string | null;
  comment: string;
  hideClose?: boolean;
}) => {
  const router = useRouter();
  const p = usePathname();

  const {
    comments,
    handleDeleteComment,
    hasMoreComments,
    isCommentDeleting,
    isFetchingMoreComments,
    ref,
  } = useComments({
    comment,
    editCommentId,
    postId: post.id,
    setComment,
    setEditCommentId,
    skipCommentsFetch: false,
  });

  return (
    <>
      <div className="border-b px-4 py-2 flex items-center gap-x-4 justify-between">
        <UserChip size="xs" user={post.user!} />
        {!hideClose && (
          <Button
            onClick={() => {
              if (setOpen) {
                setOpen(false);
              } else router.push(p);
            }}
            size="icon-xs"
            variant="secondary"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto max-h-[calc(100%-200px)] pb-8">
        <div className="p-4">
          <div className="flex gap-x-4">
            <UserAvatar
              className="size-6"
              fallbackClassName="text-base"
              username={post?.user?.username}
              url={post?.user?.profilePhoto?.url}
            />
            <div>
              <h1 className="font-bold">{post?.title}</h1>
              <ShowMore
                text={post.content}
                endContent={
                  <>
                    <br />
                    {post?.hashTags?.map(({ name }) => (
                      <Link
                        key={name}
                        className="mr-1 text-sm text-[#e0f1ff]"
                        href={`/explore/tags/${name}`}
                      >
                        <button>#{name}</button>
                      </Link>
                    ))}
                  </>
                }
              />
            </div>
          </div>
          <h1 className="font-bold text-muted-foreground mt-6 mb-2">
            Comments
          </h1>
          <div className="space-y-4">
            {comments.length === 0 ? (
              <NoContent
                icon={MessageCircle}
                title="No comments found"
                subtitle="Be the first one to comment!"
                titleClassName="text-lg"
                containerClassName="gap-1"
              />
            ) : (
              comments.map((comment) => (
                <Comment
                  handleDeleteComment={handleDeleteComment}
                  isDeletingComment={isCommentDeleting}
                  setEditCommentId={(id) => {
                    setEditCommentId(id);
                    setComment(id ? comment.content : "");
                  }}
                  editCommentId={editCommentId}
                  key={comment.id}
                  {...comment}
                />
              ))
            )}
          </div>
        </div>
        <div ref={ref} />
        {isFetchingMoreComments && (
          <Loader className="mx-auto size-6 animate-spin" />
        )}
        {!hasMoreComments && comments.length > 10 && (
          <NoContent
            size="sm"
            icon={CircleCheckBig}
            iconContainerClassName="border-none size-auto p-0"
            title="All caught up"
            subtitle="No more comments to show"
          />
        )}
      </div>
    </>
  );
};

export default PostComments;
