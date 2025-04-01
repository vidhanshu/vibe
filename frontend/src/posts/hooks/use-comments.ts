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
import { NSCommon } from "@/src/common/types";
import { NSPost } from "../types";
import useSessionStore from "@/src/common/stores/session-store";

type OldDataType = {
  pageParams: number[];
  pages: NSCommon.PaginatedResponse<NSPost.Comment>[];
};
type OldPostDataType = {
  pageParams: number[];
  pages: NSCommon.PaginatedResponse<NSPost.DetailedPost>[];
};
const useComments = ({
  postId,
  setComment,
  setEditCommentId,
  skipCommentsFetch = true,
}: {
  postId: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  setEditCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  skipCommentsFetch?: boolean;
}) => {
  const qc = useQueryClient();
  const { user } = useSessionStore();

  const { data, hasNextPage, isFetchingNextPage, isLoading, ref } = useInfinite(
    {
      fetcher: async (filters: { page: number }) =>
        await getComments(postId, filters),
      queryKey: ["comments", postId],
      enabled: !!postId && !skipCommentsFetch,
    }
  );

  // ✅ Optimistic Add Comment
  const { mutate: handleComment, isPending: isCommentAdding } = useMutation({
    mutationKey: ["add-comment"],
    mutationFn: async (optimisticCommentContent: string) => {
      if (optimisticCommentContent.trim().length === 0)
        throw new Error("Comment can't be empty");

      const { data, message } = await addComment(
        postId,
        optimisticCommentContent
      );
      if (message) toast.error(message);
      return data;
    },
    onMutate: async (optimisticCommentContent: string) => {
      await qc.cancelQueries({ queryKey: ["comments", postId] });

      const previousComments = qc.getQueryData(["comments", postId]);
      const previousPosts = qc.getQueryData(["posts"]);
      const tempId = `temp-${Date.now()}`;

      const optimisticComment = {
        id: tempId,
        content: optimisticCommentContent,
        userId: user?.id || "currentUserId",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user,
      };

      qc.setQueryData(["comments", postId], (oldData: OldDataType) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page, index) =>
            index === 0
              ? {
                  ...(page ?? {}),
                  items: [optimisticComment, ...(page?.items ?? [])],
                }
              : page
          ),
        };
      });

      // ✅ Update comment count in the posts list
      qc.setQueryData(["posts"], (oldData: OldPostDataType) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    _count: {
                      ...post._count,
                      comments: post._count.comments + 1,
                    },
                  }
                : post
            ),
          })),
        };
      });

      setComment("");
      return {
        previousComments,
        previousPosts,
        tempId,
        optimisticCommentContent,
      };
    },
    onSuccess: (newComment, _, context) => {
      if (!context) return;

      qc.setQueryData(["comments", postId], (oldData: OldDataType) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((c) =>
              c.id === context.tempId ? { ...c, id: newComment?.id } : c
            ),
          })),
        };
      });
    },
    onError: (_, __, context) => {
      console.error("❌ Error deleting comment, rolling back...", _);
      if (context?.previousComments)
        qc.setQueryData(["comments", postId], context.previousComments);
    },
  });

  // ✅ Optimistic Update Comment
  const { mutate: handleUpdateComment, isPending: isUpdatingComment } =
    useMutation({
      mutationKey: ["update-comment"],
      mutationFn: async ({
        editCommentId,
        updatedCommentContent,
      }: {
        editCommentId: string;
        updatedCommentContent: string;
      }) => {
        if (!editCommentId) throw new Error("editCommentId not present");
        if (!updatedCommentContent.trim().length) {
          throw new Error("Comment can't be empty");
        }

        const res = await updateComment(
          postId,
          editCommentId,
          updatedCommentContent
        );
        if (res.message) {
          toast.error(res.message);
          return null;
        }
        return res;
      },
      onMutate: async ({
        editCommentId,
        updatedCommentContent,
      }: {
        editCommentId: string;
        updatedCommentContent: string;
      }) => {
        await qc.cancelQueries({ queryKey: ["comments", postId] });

        const previousComments = qc.getQueryData(["comments", postId]);

        qc.setQueryData(["comments", postId], (oldData: OldDataType) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((c) =>
                c.id === editCommentId
                  ? {
                      ...c,
                      content: updatedCommentContent,
                      updatedAt: new Date().toISOString(),
                    }
                  : c
              ),
            })),
          };
        });

        setEditCommentId(null);
        setComment("");

        return { previousComments, updatedCommentContent };
      },
      onError: (_, __, context) => {
        console.error("❌ Error deleting comment, rolling back...", _);
        if (context?.previousComments)
          qc.setQueryData(["comments", postId], context.previousComments);
      },
    });

  // ✅ Optimistic Delete Comment
  const { mutate: handleDeleteComment, isPending: isCommentDeleting } =
    useMutation({
      mutationKey: ["delete-comment"],
      mutationFn: async (commentId: string) => {
        const res = await deleteComment(postId, commentId);
        if (res.message) {
          toast.error(res.message);
          return null;
        }
        return res;
      },
      onMutate: async (commentId) => {
        await qc.cancelQueries({ queryKey: ["comments", postId] });

        const previousComments = qc.getQueryData(["comments", postId]);
        const previousPosts = qc.getQueryData(["posts"]);

        qc.setQueryData(["comments", postId], (oldData: OldDataType) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((c) => c.id !== commentId),
            })),
          };
        });

        // ✅ Update comment count in the posts list
        qc.setQueryData(["posts"], (oldData: OldPostDataType) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((post) =>
                post.id === postId
                  ? {
                      ...post,
                      _count: {
                        ...post._count,
                        comments: Math.max(post._count.comments - 1, 0), // Ensure it doesn't go below 0
                      },
                    }
                  : post
              ),
            })),
          };
        });

        return { previousComments, previousPosts };
      },
      onError: (_, __, context) => {
        console.error("❌ Error deleting comment, rolling back...", _);
        if (context?.previousComments)
          qc.setQueryData(["comments", postId], context.previousComments);
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
