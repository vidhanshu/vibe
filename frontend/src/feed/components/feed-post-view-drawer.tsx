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
import usePost from "@/src/posts/hooks/use-post";
import NoContent from "@/src/users/components/no-content";
import { Loader2 } from "lucide-react";
import { useState } from "react";

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

  return (
    <Drawer open={!!postId} onClose={cancelView}>
      <DrawerContent className="max-w-2xl mx-auto h-full">
        <DrawerHeader>
          <DrawerTitle>{post?.title}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        {isPostLoading ? (
          <div className="flex items-center justify-center pt-8">
            <Loader2 className="animate-spin size-10" />
          </div>
        ) : post ? (
          <>
            <PostComments
              post={post}
              hideClose
              comment={comment}
              setComment={setComment}
              editCommentId={editCommentId}
              setEditCommentId={setEditCommentId}
              setOpen={() => {}}
            />
            <PostFooter
              post={post}
              comment={comment}
              setComment={setComment}
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
      </DrawerContent>
    </Drawer>
  );
};

export default FeedPostViewDrawer;
