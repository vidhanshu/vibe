import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import useSessionStore from "@/src/common/stores/session-store";
import { usersService } from "@/src/users/users.service";
import { router } from "expo-router";

const SessionProvider = ({ children }: PropsWithChildren) => {
  const { setSession } = useSessionStore();

  useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        message,
        data = null,
        statusCode,
      } = await usersService.getProfile();
      if (message) {
        if (statusCode === 401) {
          setSession(null); // will set loading to false
        }
        return null;
      }
      setSession(data);
      router.replace("/"); // to handle login after sign in/up as we are invalidating this query on these cases it takes time to invalidate
      return data;
    },
  });

  return children;
};

export default SessionProvider;
