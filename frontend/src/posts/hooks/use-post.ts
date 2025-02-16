import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import {
  addComment,
  deleteComment,
  getComments,
  getPostById,
  likeUnLike,
  updateComment,
} from "../actions/posts-actions";

const usePost = ({
  postId,
  comment,
  editCommentId,
  setComment,
  setEditCommentId,
}: {
  postId: string;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  editCommentId: string | null;
  setEditCommentId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const qc = useQueryClient();
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data, message } = await getPostById(postId);
      // if (message) toast.error(message);
      return data;
    },
    enabled: !!postId,
  });

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, message } = await getComments(postId, {});
      // if (message) toast.error(message);
      return data;
    },
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

  const { mutate: handleComment, isPending: isCommentAdding } = useMutation({
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

  const { mutate: handleUpdateComment, isPending: isUpdatingComment } =
    useMutation({
      mutationKey: ["update-comment"],
      mutationFn: async () => {
        if (!editCommentId) return;
        const res = await updateComment(postId, editCommentId, comment);
        if (res.message) {
          toast.error(res.message);
          return null;
        }
        qc.invalidateQueries({ queryKey: ["comments"] });
        setEditCommentId(null);
        setComment("");
        return res;
      },
    });

  const { mutate: handleDeleteComment, isPending: isCommentDeleting } =
    useMutation({
      mutationKey: ["delete-comment"],
      mutationFn: async (commentId: string) => {
        const res = await deleteComment(postId, commentId);
        if (res.message) {
          toast.error(res.message);
          return null;
        }
        qc.invalidateQueries({ queryKey: ["comments"] });
        return res;
      },
    });

  return {
    post,
    comments,
    isPostLoading,
    isCommentsLoading,
    isCommentAdding,
    isUpdatingComment,
    isCommentDeleting,
    handleLike,
    handleComment,
    handleUpdateComment,
    handleDeleteComment,
  };
};

export default usePost;
