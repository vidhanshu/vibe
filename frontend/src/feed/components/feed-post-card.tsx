import Button from "@/components/ui/button";
import PostFooter from "@/src/common/components/modals/view-post-modal/post-footer";
import PostMediaCarousel from "@/src/common/components/modals/view-post-modal/post-media-carousel";
import useSessionStore from "@/src/common/stores/session-store";
import { getShortRelativeTime } from "@/src/common/utils/dayjs";
import { NSPost } from "@/src/posts/types";
import {
  Ellipsis,
  Paperclip,
  Pencil,
  Share, Trash
} from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deletePost } from "@/src/posts/actions/posts-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import UserChip from "@/src/common/components/user-chip";

const FeedPostCard = ({
  detailedPost,
  setEditPostId,
  setViewPostId,
}: {
  detailedPost: NSPost.DetailedPost;
  setEditPostId: (id: string) => void;
  setViewPostId: (id: string) => void;
}) => {
  const { id, createdAt, medias, title, user, liked } = detailedPost;

  const qc = useQueryClient();
  const [comment, setComment] = useState("");
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_copiedText, copyText] = useCopyToClipboard();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await deletePost(id);
      if (res.message) toast.error(res.message);
      else toast.success("Post deleted successfully");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const currentUserId = useSessionStore((select) => select.user?.id);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2 md:px-0">
          <div className="flex gap-x-2 items-center">
            <UserChip size="sm" user={user} hideName />
            <p className="font-bold text-muted-foreground text-sm">
              {" "}
              . {getShortRelativeTime(createdAt)}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete post &ldquo;{title}&rdquo;
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? This action is irreversible
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row justify-end gap-x-4">
                <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => mutate()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-xs" variant="ghost">
                  <Ellipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Post options</DropdownMenuLabel>
                {user?.id === currentUserId ? (
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setEditPostId(id)}
                      className="text-blue-500"
                    >
                      <Pencil />
                      <span>Edit post</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="text-rose-500">
                      <AlertDialogTrigger className="flex gap-x-2 items-center">
                        <>
                          <Trash />
                          <span>Delete post</span>
                        </>
                      </AlertDialogTrigger>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem disabled>
                    <Share />
                    <span>Share to...</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      copyText(
                        window.location.href +
                          `/users/${user.username}?postId=${id}`
                      );
                      toast.success("Link copied to clipboard");
                    }}
                  >
                    <Paperclip />
                    <span>Copy link</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </AlertDialog>
        </div>
        <div className="h-[489px] md:h-[578px] flex items-center justify-center border-y md:border">
          <PostMediaCarousel
            containerClassName="flex-1"
            imageClassName="w-full max-h-[578px]"
            videoClassName="max-h-[578px] w-full"
            title={title}
            postId={id}
            medias={medias}
            isLiked={!!liked}
          />
        </div>
        {detailedPost && (
          <PostFooter
            autoFocusComment={false}
            variant="feed"
            className="px-2 md:px-0"
            comment={comment}
            setComment={setComment}
            editCommentId={editCommentId}
            setEditCommentId={setEditCommentId}
            post={detailedPost}
            pathToCopy={
              window.location.href + `/users/${user.username}?postId=${id}`
            }
            onCommentClick={() => {
              setViewPostId(id);
            }}
          />
        )}
      </div>
    </>
  );
};

export default FeedPostCard;
