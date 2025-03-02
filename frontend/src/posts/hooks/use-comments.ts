import useInfinite from "@/src/common/hooks/use-infinite";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../actions/posts-actions";

const useComments = ({
  postId,
  comment,
  editCommentId,
  setComment,
  setEditCommentId,
  skipCommentsFetch = true,
}: {
  postId: string;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  editCommentId: string | null;
  setEditCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  skipCommentsFetch?: boolean;
}) => {
  const qc = useQueryClient();

  const { data, hasNextPage, isFetchingNextPage, isLoading, ref } =
    useInfinite({
      fetcher: async (filters: { page: number }) =>
        await getComments(postId, filters),
      queryKey: ["comments", postId],
      enabled: !!postId && !skipCommentsFetch,
    });

  const { mutate: handleComment, isPending: isCommentAdding } = useMutation({
    mutationKey: ["add-comment"],
    mutationFn: async () => {
      const { data, message } = await addComment(postId, comment);
      if (message) toast.error(message);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["post", postId] });
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
    comments: data?.map((data) => data.items).flat(),
    isCommentsLoading: isLoading,
    hasMoreComments: hasNextPage,
    isFetchingMoreComments: isFetchingNextPage,
    ref,
    isCommentAdding,
    isUpdatingComment,
    isCommentDeleting,
    handleComment,
    handleUpdateComment,
    handleDeleteComment,
  };
};

export default useComments;
