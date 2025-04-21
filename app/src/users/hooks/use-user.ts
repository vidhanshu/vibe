import { useQuery } from "@tanstack/react-query";
import { usersService } from "../users.service";
import useAppToast from "@/src/common/hooks/use-app-toast";

const useUser = ({ username }: { username: string }) => {
  const toast = useAppToast({});
  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const res = await usersService.getUserByUsername(username as string);
      if (res.message) {
        toast.error(res.message);
        return null;
      }
      return res.data;
    },
    enabled: !!username,
  });

  return {
    user: data,
    isUserLoading: isLoading,
    refetchUser: refetch,
    isRefetchingUser: isRefetching,
  };
};

export default useUser;
