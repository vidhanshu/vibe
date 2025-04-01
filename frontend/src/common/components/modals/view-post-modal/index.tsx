"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useIsMobile from "@/src/common/hooks/use-is-mobile";
import usePost from "@/src/posts/hooks/use-post";
import NoContent from "@/src/users/components/no-content";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import PostComments from "./post-comments";
import PostFooter from "./post-footer";
import PostMediaCarousel from "./post-media-carousel";
import PostSkeleton from "./post-skeleton";

interface ViewPostModalProps {
  postId: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  skipPostFetch?: boolean;
}
const ViewPostModal = ({ postId, open, setOpen }: ViewPostModalProps) => {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const p = usePathname();
  const sp = useSearchParams();
  const pathname =
    (typeof window === "undefined" ? "" : window.location.href) +
    p +
    sp.toString();
  const commentInputRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);

  const { isPostLoading, post } = usePost({
    postId,
    skipPostFetch: !postId,
  });

  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        hideCloseBtn
        overlayProps={{
          onClick: () => {
            if (setOpen) {
              setOpen(false);
            } else {
              router.push(p);
            }
          },
        }}
        className="md:w-full h-full md:max-w-[1050px] max-h-[calc(100vh-50px)] p-0 py-2 md:p-0 bg-background overflow-y-auto border-none sm:rounded-none rounded-none"
      >
        <DialogHeader className="hidden">
          <DialogTitle> </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {isPostLoading ? (
          <PostSkeleton />
        ) : post ? (
          <div className="flex flex-col md:grid md:grid-cols-12">
            <PostMediaCarousel
              title={post?.title ?? ""}
              medias={post?.medias ?? []}
              postId={post.id}
              isLiked={!!post?.liked}
            />
            <div className="col-span-5 flex flex-col max-h-[calc(100vh-50px)]">
              <PostComments
                post={post}
                setComment={setComment}
                editCommentId={editCommentId}
                setEditCommentId={setEditCommentId}
                commentInputRef={commentInputRef}
                setOpen={setOpen}
              />
              <PostFooter
                post={post}
                comment={comment}
                setComment={setComment}
                pathToCopy={pathname}
                commentInputRef={commentInputRef}
                editCommentId={editCommentId}
                autoFocusComment={!isMobile}
                setEditCommentId={setEditCommentId}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <NoContent title="No post found" subtitle="404" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewPostModal;
