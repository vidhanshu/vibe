"use client";

import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import useSessionStore from "@/src/common/stores/session-store";
import { toast } from "sonner";
import { getProfile } from "@/src/users/actions/user-actions";
import { useRouter } from "next/navigation";

const SessionProvider = ({ children }: PropsWithChildren) => {
  const { setSession } = useSessionStore();
  const router = useRouter();

  useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { message, user = null, statusCode } = await getProfile();
      if (message) {
        toast.error(message);
        if (statusCode === 401) router.replace("/auth");
        return null;
      }
      setSession(user);
      return user;
    },
  });

  return children;
};

export default SessionProvider;
