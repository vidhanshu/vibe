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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import {
  addComment,
  getComments,
  getPostById,
  likeUnLike,
} from "@/src/posts/actions/posts-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Forward,
  Heart,
  MessageCircle,
  Smile,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSessionStore from "../../stores/session-store";
import { getShortRelativeTime } from "../../utils/dayjs";
import EmojiPicker from "../popovers/emoji-picker";
import ShowMore from "../show-more";

interface ViewPostModalProps {
  postId: string;
  children: (props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}
const ViewPostModal = ({ children, postId }: ViewPostModalProps) => {
  const currentUserId = useSessionStore((select) => select.user?.id);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  const commentInputRef = useRef<HTMLInputElement>(null);

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const { data, message } = await getComments(postId, {});
      if (message) toast.error(message);
      return data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data, message } = await getPostById(postId);
      if (message) toast.error(message);
      return data;
    },
    enabled: !!postId && open,
  });

  const { mutate: handleLike } = useMutation({
    mutationKey: ["like-post"],
    mutationFn: async () => {
      const { data, message } = await likeUnLike(postId);
      if (message) toast.error(message);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const { mutate: handleComment } = useMutation({
    mutationKey: ["add-comment"],
    mutationFn: async () => {
      const { data, message } = await addComment(postId, comment);
      if (message) toast.error(message);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["post", postId] });
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["comments"] });
      setComment("");
    },
  });

  const LENGTH = data?.medias.length ?? 0;

  useEffect(() => {
    if (!currentUserId) return;
    if (data?.likes?.some(({ userId }) => userId === currentUserId))
      setLiked(true);
  }, [data, currentUserId]);

  const isFetching = isLoading || isLoadingComments;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children({ open, setOpen })}</DialogTrigger>
      <DialogContent
        hideCloseBtn
        className="w-full h-full max-w-screen-xl max-h-[calc(100vh-32px)] p-0 bg-black"
      >
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="grid grid-cols-12">
            <div className="col-span-7 p-4">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="col-span-5 p-4 space-y-4">
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
                {Array.from({ length: 8 }).map((_, idx) => (
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
          </div>
        ) : (
          <div className="grid grid-cols-12">
            <div className="col-span-7 flex items-center justify-center border-r  relative">
              <Image
                width={500}
                height={500}
                alt={data?.title!}
                src={data?.medias[active].url!}
                className="w-[calc(100%-20px)] max-h-[calc(100vh-100px)] object-contain object-center"
              />
              {LENGTH > 1 && (
                <>
                  <Button
                    size="icon-sm"
                    variant="secondary"
                    className="absolute inset-y-0 my-auto left-4"
                    onClick={() =>
                      setActive((prev) => (prev - 1 + LENGTH) % LENGTH)
                    }
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="secondary"
                    className="absolute inset-y-0 my-auto right-4"
                    onClick={() => setActive((prev) => (prev + 1) % LENGTH)}
                  >
                    <ChevronRight />
                  </Button>
                </>
              )}
            </div>

            <div className="col-span-5 flex flex-col max-h-[calc(100vh-32px)]">
              <div className="border-b px-4 py-2 flex items-center gap-x-4 justify-between">
                <Link
                  href={`users/${data?.user?.username}`}
                  className="flex items-center gap-x-4"
                >
                  <UserAvatar
                    className="size-6"
                    fallbackClassName="text-base"
                    username={data?.user?.username}
                    url={data?.user?.profilePhoto}
                  />
                  {data?.user?.username}
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
                      username={data?.user?.username}
                      url={data?.user?.profilePhoto}
                    />
                    <div>
                      <h1 className="font-bold">{data?.title}</h1>
                      <ShowMore text={data?.content ?? ""} />
                    </div>
                  </div>
                  <h1 className="font-bold text-muted-foreground mt-6 mb-2">
                    Comments
                  </h1>
                  <div className="space-y-4">
                    {comments?.items.map(({ id, content, user, createdAt }) => (
                      <div key={id} className="flex gap-x-4">
                        <UserAvatar
                          username={user?.username}
                          url={user.profilePhoto}
                        />
                        <div className="space-y-2">
                          <Link
                            href={`/users/${user.username}`}
                            className="font-bold hover:cursor-pointer"
                          >
                            {user.username}
                          </Link>
                          <p className="text-sm">{content}</p>
                          <div className="flex gap-x-4 items-center">
                            <p className="text-xs text-muted-foreground font-bold">
                              {getShortRelativeTime(createdAt!)}
                            </p>
                            {user.id === currentUserId && (
                              <>
                                <button className="text-blue-500 text-xs font-bold">
                                  Edit
                                </button>
                                <button className="text-rose-500 text-xs font-bold">
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
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
                    <Button variant="secondary" size="icon-xs">
                      <Bookmark className="size-4" />
                    </Button>
                  </div>
                  <div>
                    <h1 className="font-bold">{data?._count.likes} likes</h1>
                    <p className="text-sm text-muted-foreground">
                      {dayjs(data?.createdAt).format("MMMM D, YYYY")}
                    </p>
                  </div>
                </div>
                <Separator />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!comment.trim().length)
                      return toast.error("Comment cannot be empty");
                    handleComment();
                  }}
                  className="flex items-center px-4"
                >
                  <EmojiPicker
                    onEmojiClick={(e) => setComment((p) => `${p} ${e}`)}
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
                    Post
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
