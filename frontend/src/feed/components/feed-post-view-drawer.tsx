"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import PostComments from "@/src/common/components/modals/view-post-modal/post-comments";
import PostFooter from "@/src/common/components/modals/view-post-modal/post-footer";
import PostMediaCarousel from "@/src/common/components/modals/view-post-modal/post-media-carousel";
import usePost from "@/src/posts/hooks/use-post";
import NoContent from "@/src/users/components/no-content";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";

const FeedPostViewDrawer = ({
  postId,
  cancelView,
}: {
  postId: string | null;
  cancelView: () => void;
}) => {
  const [comment, setComment] = useState("");
  const [editCommentId, setEditCommentId] = useState<null | string>(null);
  const { isPostLoading, post } = usePost({
    postId: postId!,
    skipPostFetch: !postId,
  });
  const commentInputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  return (
    <Drawer open={!!postId} onClose={cancelView}>
      <DrawerContent className="max-w-2xl mx-auto h-full">
        <DrawerHeader>
          <DrawerTitle>{post?.title}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="h-full max-h-[calc(100vh-66px)] overflow-y-auto">
          {post && (
            <PostMediaCarousel
              title={post?.title ?? ""}
              medias={post?.medias ?? []}
              postId={post?.id}
              isLiked={!!post?.liked}
            />
          )}
          {isPostLoading ? (
            <div className="flex items-center justify-center pt-8">
              <Loader2 className="animate-spin size-10" />
            </div>
          ) : post ? (
            <>
              <PostComments
                post={post}
                hideClose
                setComment={setComment}
                editCommentId={editCommentId}
                setEditCommentId={setEditCommentId}
                commentInputRef={commentInputRef}
                setOpen={() => {}}
              />
              <PostFooter
                post={post}
                comment={comment}
                setComment={setComment}
                commentInputRef={commentInputRef}
                pathToCopy={`${window.location.href}/users/${post?.user?.username}?postId=${post.id}`}
                editCommentId={editCommentId}
                autoFocusComment={false}
                setEditCommentId={setEditCommentId}
              />
            </>
          ) : (
            <NoContent
              title="Post not found"
              subtitle="This post doesn't exists, may have been deleted or blocked"
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FeedPostViewDrawer;
