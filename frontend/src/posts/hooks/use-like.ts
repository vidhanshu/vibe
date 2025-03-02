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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["post", postId] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    handleLike,
  };
};

export default useLike;
