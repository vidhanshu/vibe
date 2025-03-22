"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers } from "@/src/users/actions/user-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import UserChip from "@/src/common/components/user-chip";
import NoContent from "@/src/users/components/no-content";
import { useRouter } from "next/navigation";
import { createChat } from "@/src/chats/actions/chats-action";
import useSessionStore from "@/src/common/stores/session-store";

const ChatUsersModal = ({
  children,
  onSelect,
}: PropsWithChildren & { onSelect?: (userId: string) => void }) => {
  const router = useRouter();
  const userId = useSessionStore((s) => s.user?.id);
  const [open, setOpen] = useState(false);
  const [debouncedValue, setDebouncedValue] = useDebounceValue("", 1000);
  const qc = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["chat-users-search"],
    queryFn: async () => {
      setIsLoading(true);
      const { data, message } = await getUsers({
        search: debouncedValue,
      });
      setIsLoading(false);
      if (message) toast.error(message);
      return data;
    },
  });

  useEffect(() => {
    if (!debouncedValue.trim().length) {
      qc?.setQueryData(["chat-users-search"], null);
      return;
    }
    setIsLoading(true);
    refetch().finally(() => {
      setIsLoading(false);
    });
  }, [debouncedValue, qc, refetch]);

  const handleUserSelect = async (userId: string) => {
    setOpen(false);
    const res = await createChat({
      chatType: "DM",
      participantId: userId,
    });

    if (res.data?.id) {
      if (!res.data?.existsAlready) {
        // Reset the infinite query cache and trigger a refetch
        await qc.resetQueries({ queryKey: ["chats"] });
      }
      router.push(`/chats/${res.data.id}`);
    } else if (res.message) {
      toast.error(res.message);
    }
  };

  const usersExcludingMe = useMemo(
    () => data?.items.filter((user) => user.id !== userId),
    [data, userId]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md py-4 px-0 gap-0">
        <DialogHeader className="px-4 border-b pb-4">
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div className="">
          <div className="flex items-center gap-2 px-2 border-b">
            <span className="font-bold">To:</span>
            <Input
              placeholder="Search..."
              className="border-0 outline-none focus-visible:ring-0"
              onChange={(e) => {
                setDebouncedValue(e.target.value);
              }}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col gap-2 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 px-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !usersExcludingMe?.length ? (
              <div className="p-2">
                <NoContent
                  icon={User}
                  title="No users found"
                  subtitle="Try searching with a different keyword"
                />
              </div>
            ) : (
              <div className="flex flex-col">
                {usersExcludingMe?.map((user) => (
                  <button
                    key={user.id}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-accent transition-colors"
                    onClick={() => {
                      onSelect?.(user.id);
                      handleUserSelect(user.id);
                    }}
                  >
                    <UserChip noLink user={user} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatUsersModal;
