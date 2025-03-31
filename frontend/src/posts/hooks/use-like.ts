import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { likeUnLike } from "../actions/posts-actions";

const useLike = ({ postId }: { postId: string }) => {
  const qc = useQueryClient();

  const { mutate: handleLike } = useMutation({
    mutationKey: ["like-post"],
    mutationFn: async () => {
      const { data, message } = await likeUnLike(postId);
      if (message) toast.error(message);
      return data;
    },
    onMutate: async () => {
      console.log("🔄 Optimistic update triggered for post", postId);

      await qc.cancelQueries({ queryKey: ["posts"] });
      await qc.cancelQueries({ queryKey: ["post", postId] });

      const previousPosts = qc.getQueryData(["posts"]);
      const previousPost = qc.getQueryData(["post", postId]);

      console.log("📌 Previous posts data:", previousPosts);
      console.log("📌 Previous post data:", previousPost);

      // Optimistic update for feed posts
      qc.setQueryData(["posts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    liked: !post.liked,
                    _count: {
                      ...post._count,
                      likes: post.liked
                        ? post._count.likes - 1
                        : post._count.likes + 1,
                    },
                  }
                : post
            ),
          })),
        };
      });

      // Optimistic update for modal post
      qc.setQueryData(["post", postId], (oldPost: any) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          liked: !oldPost.liked,
          _count: {
            ...oldPost._count,
            likes: oldPost.liked
              ? oldPost._count.likes - 1
              : oldPost._count.likes + 1,
          },
        };
      });

      return { previousPosts, previousPost };
    },
    onError: (_, __, context) => {
      console.error("❌ Error occurred! Rolling back...");
      if (context?.previousPosts)
        qc.setQueryData(["posts"], context.previousPosts);
      if (context?.previousPost)
        qc.setQueryData(["post", postId], context.previousPost);
    },
    onSettled: () => {
      console.log("✅ Like mutation settled.");
    },
  });

  return {
    handleLike,
  };
};

export default useLike;
