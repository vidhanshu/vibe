import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { followUnfollow } from "../actions/follow-actions";

const useFollow = ({
  queryKesToInvalidate = [],
  // follows = false,
}: {
  queryKesToInvalidate?: string[][];
  follows?: boolean;
}) => {
  const qc = useQueryClient();

  const { mutate: handleFollowUnfollow, isPending } = useMutation({
    mutationKey: ["follows"],
    mutationFn: async ({
      userId,
    }: // username,
    {
      userId: string;
      username?: string;
    }) => {
      const res = await followUnfollow(userId);
      if (res.message) {
        toast.error(res.message);
      } else {
        // if (username) {
        //   toast.success(
        //     `${follows ? "unfollowed" : "followed"} ${username} successfully`
        //   );
        // } else {
        //   toast.success(`${follows ? "unfollowed" : "followed"} successfully`);
        // }
        queryKesToInvalidate.forEach((qk) => {
          qc.invalidateQueries({ queryKey: qk });
        });
      }
      return res.data;
    },
  });

  return {
    handleFollowUnfollow,
    isPending,
  };
};

export default useFollow;
