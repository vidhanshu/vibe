import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../actions/posts-actions";

const usePost = ({
  postId,
  skipPostFetch = true,
}: {
  postId: string;
  skipPostFetch?: boolean;
}) => {
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await getPostById(postId);
      return data;
    },
    enabled: !!postId && !skipPostFetch,
  });

  return {
    post,
    isPostLoading,
  };
};

export default usePost;
