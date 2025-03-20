import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveUnsave } from "../actions/posts-actions";

const useBookmarkPost = ({ postId }: { postId: string }) => {
  const qc = useQueryClient();
  const { mutate: handleSave } = useMutation({
    mutationKey: ["save-post"],
    mutationFn: async () => {
      const { data, message } = await saveUnsave(postId);
      if (message) toast.error(message);
      else toast.success(data?.message);
      return data;
    },
    onSuccess: () => {
      // TODO: Optimize this fetches, as just a single save/unsave refetching all posts
      qc.invalidateQueries({ queryKey: ["post", postId] });
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["saved-posts"] });
    },
  });

  return {
    handleSave,
  };
};

export default useBookmarkPost;
