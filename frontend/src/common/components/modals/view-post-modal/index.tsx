"use client";

import Button from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import usePost from "@/src/posts/hooks/use-post";
import dayjs from "dayjs";
import {
  Bookmark,
  Forward,
  Heart,
  MessageCircle,
  Smile,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSessionStore from "../../../stores/session-store";
import EmojiPicker from "../../popovers/emoji-picker";
import ShowMore from "../../show-more";
import Comment from "./comment";
import PostMediaCarousel from "./post-media-carousel";
import PostSkeleton from "./post-skeleton";

interface ViewPostModalProps {
  postId: string;
  children: (props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}
const ViewPostModal = ({ children, postId }: ViewPostModalProps) => {
  const currentUserId = useSessionStore((select) => select.user?.id);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);

  const commentInputRef = useRef<HTMLInputElement>(null);

  const {
    comments,
    handleComment,
    handleDeleteComment,
    handleLike,
    handleUpdateComment,
    isCommentDeleting,
    isPostLoading,
    post,
  } = usePost({
    postId,
    comment,
    editCommentId,
    open,
    setComment,
    setEditCommentId,
  });

  useEffect(() => {
    if (!currentUserId) return;
    if (post?.likes?.some(({ userId }) => userId === currentUserId))
      setLiked(true);
  }, [post, currentUserId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children({ open, setOpen })}</DialogTrigger>
      <DialogContent
        hideCloseBtn
        className="w-full h-full max-w-screen-xl max-h-[calc(100vh-32px)] p-0 bg-black"
      >
        <DialogHeader className="hidden">
          <DialogTitle> </DialogTitle>
        </DialogHeader>

        {isPostLoading ? (
          <PostSkeleton />
        ) : (
          <div className="grid grid-cols-12">
            <PostMediaCarousel
              title={post?.title!}
              medias={post?.medias ?? []}
            />

            <div className="col-span-5 flex flex-col max-h-[calc(100vh-32px)]">
              <div className="border-b px-4 py-2 flex items-center gap-x-4 justify-between">
                <Link
                  href={`users/${post?.user?.username}`}
                  className="flex items-center gap-x-4"
                >
                  <UserAvatar
                    className="size-6"
                    fallbackClassName="text-base"
                    username={post?.user?.username}
                    url={post?.user?.profilePhoto}
                  />
                  {post?.user?.username}
                </Link>
                <DialogClose asChild>
                  <Button size="icon-xs" variant="secondary">
                    <X className="size-4" />
                  </Button>
                </DialogClose>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[calc(100%-200px)]">
                <div className="p-4">
                  <div className="flex gap-x-4">
                    <UserAvatar
                      className="size-6"
                      fallbackClassName="text-base"
                      username={post?.user?.username}
                      url={post?.user?.profilePhoto}
                    />
                    <div>
                      <h1 className="font-bold">{post?.title}</h1>
                      <ShowMore text={post?.content ?? ""} />
                    </div>
                  </div>
                  <h1 className="font-bold text-muted-foreground mt-6 mb-2">
                    Comments
                  </h1>
                  <div className="space-y-4">
                    {comments?.items.map((comment) => (
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
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t py-2 space-y-2">
                <div className="px-4 space-y-4">
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
                        onClick={() => commentInputRef?.current?.focus()}
                      >
                        <MessageCircle className="size-4" />
                      </Button>
                      <Button variant="secondary" size="icon-xs">
                        <Forward className="size-4" />
                      </Button>
                    </div>
                    {post?.userId !== currentUserId && (
                      <Button variant="secondary" size="icon-xs">
                        <Bookmark className="size-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h1 className="font-bold">{post?._count.likes} likes</h1>
                    <p className="text-sm text-muted-foreground">
                      {dayjs(post?.createdAt).format("MMMM D, YYYY")}
                    </p>
                  </div>
                </div>

                <Separator />

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
                  className="flex items-center px-4"
                >
                  <EmojiPicker
                    onEmojiClick={(e) => setComment((p) => `${p}${e}`)}
                  >
                    {({ open, setOpen }) => (
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="secondary"
                        className="min-w-7"
                        onClick={() => setOpen((p) => !p)}
                      >
                        <Smile
                          className={cn("size-4", open && "text-blue-500")}
                        />
                      </Button>
                    )}
                  </EmojiPicker>
                  <Input
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
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewPostModal;
