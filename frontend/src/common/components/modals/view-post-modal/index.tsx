"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import usePost from "@/src/posts/hooks/use-post";
import NoContent from "@/src/users/components/no-content";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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
  const pathname = window.location.href + p + sp.toString();
  const [editCommentId, setEditCommentId] = useState<string | null>(null);

  const { isPostLoading, post } = usePost({
    postId,
    skipPostFetch: false,
  });

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
        className="w-full h-full max-w-screen-xl max-h-[calc(100vh-32px)] p-0 bg-black"
      >
        <DialogHeader className="hidden">
          <DialogTitle> </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {isPostLoading ? (
          <PostSkeleton />
        ) : post ? (
          <div className="grid grid-cols-12">
            <PostMediaCarousel
              title={post?.title ?? ""}
              medias={post?.medias ?? []}
            />
            <div className="col-span-5 flex flex-col max-h-[calc(100vh-32px)]">
              <PostComments
                post={post}
                comment={comment}
                setComment={setComment}
                editCommentId={editCommentId}
                setEditCommentId={setEditCommentId}
                setOpen={setOpen}
              />
              <PostFooter
                post={post}
                comment={comment}
                setComment={setComment}
                pathToCopy={pathname}
                editCommentId={editCommentId}
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
