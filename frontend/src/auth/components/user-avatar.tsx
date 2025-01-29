import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useSessionStore from "@/src/common/stores/session-store";

const UserAvatar = () => {
  const { isLoading, user } = useSessionStore();

  if (isLoading) return <Skeleton className="size-7 rounded-full" />;

  return (
    <Avatar className="size-6">
      <AvatarImage src={user?.profilePhoto?.url} alt="@vibe" />
      <AvatarFallback>
        {user?.username?.[0].toUpperCase() ?? "V"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
