import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useSessionStore from "@/src/common/stores/session-store";
import { NSPost } from "@/src/posts/types";
import dayjs from "dayjs";
import { Bookmark, Forward, Heart, MessageCircle, Smile } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import EmojiPicker from "../../popovers/emoji-picker";
import ShowMore from "../../show-more";

const PostFooter = ({
  liked,
  setLiked,
  handleLike,
  comment,
  setComment,
  post,
  editCommentId,
  handleComment,
  handleUpdateComment,
  className,
  variant = "detailed",
  onCommentClick,
  autoFocusComment = true,
  pathToCopy,
}: {
  liked: boolean;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  handleLike: () => void;
  handleUpdateComment: () => void;
  handleComment: () => void;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  post: NSPost.DetailedPost;
  editCommentId: string | null;
  className?: string;
  autoFocusComment?: boolean;
  variant?: "detailed" | "feed";
  onCommentClick?: () => void;
  pathToCopy?: string;
}) => {
  const currentUserId = useSessionStore((select) => select.user?.id);

  const commentInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_copiedText, copyText] = useCopyToClipboard();

  const isFeedVariant = variant === "feed";

  return (
    <div
      className={cn(isFeedVariant ? "" : "border-t py-2 space-y-2", className)}
    >
      <div className={cn(isFeedVariant ? "space-y-2" : "px-4 space-y-4")}>
        <div className="flex gap-x-2 items-center justify-between">
          <div className="flex gap-x-2 items-center">
            <Button
              size="icon-xs"
              variant={liked ? "destructive" : "secondary"}
              onClick={() => {
                handleLike();
                setLiked((prev) => !prev);
              }}
            >
              <Heart className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => {
                if (onCommentClick) onCommentClick();
                else commentInputRef?.current?.focus();
              }}
            >
              <MessageCircle className="size-4" />
            </Button>
            <Button
              onClick={() => {
                console.log({ pathToCopy });
                if (pathToCopy) {
                  copyText(pathToCopy);
                  toast.success("Link copied to clipboard");
                }
              }}
              variant="secondary"
              size="icon-xs"
            >
              <Forward className="size-4" />
            </Button>
          </div>
          {post.userId !== currentUserId && (
            <Button variant="secondary" size="icon-xs">
              <Bookmark className="size-4" />
            </Button>
          )}
        </div>
        <div>
          <h1 className="font-bold">{post._count.likes} likes</h1>
          {isFeedVariant ? (
            <div className="mb-2">
              <div className="space-y-2">
                <div>
                  <Link href={`/users/${post.user.username}`}>
                    <span className="font-bold mr-2">{post.user.username}</span>
                  </Link>
                  <span>{post.title}</span>
                </div>
                <ShowMore text={post.content} />
                <div
                  onClick={() => onCommentClick?.()}
                  className="text-sm text-muted-foreground cursor-pointer font-semibold"
                >
                  View{" "}
                  {post._count.comments ? `all ${post._count.comments}` : ""}{" "}
                  Comments
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {dayjs(post.createdAt).format("MMMM D, YYYY")}
            </p>
          )}
        </div>
      </div>

      {isFeedVariant ? null : <Separator />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!comment.trim().length)
            return toast.error("Comment cannot be empty");
          if (editCommentId) {
            handleUpdateComment();
          } else {
            handleComment();
          }
        }}
        className={cn(
          isFeedVariant ? "flex items-center" : "flex items-center px-4"
        )}
      >
        <EmojiPicker onEmojiClick={(e) => setComment((p) => `${p}${e}`)}>
          {({ open, setOpen }) => (
            <Button
              type="button"
              size="icon-xs"
              variant="secondary"
              className="min-w-7"
              onClick={() => setOpen((p) => !p)}
            >
              <Smile className={cn("size-4", open && "text-blue-500")} />
            </Button>
          )}
        </EmojiPicker>
        <Input
          autoFocus={autoFocusComment}
          ref={commentInputRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="focus-visible:outline-none focus-visible:ring-0 border-none text-base bg-black"
        />
        <button
          disabled={!comment.trim().length}
          className={cn(
            "text-blue-400 font-bold",
            !comment.trim().length && "text-blue-500/50"
          )}
        >
          {editCommentId ? "Update" : "Post"}
        </button>
      </form>
    </div>
  );
};

export default PostFooter;
