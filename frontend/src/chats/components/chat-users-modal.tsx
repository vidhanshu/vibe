"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getUsers } from "@/src/users/actions/user-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, User, X } from "lucide-react";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import UserChip from "@/src/common/components/user-chip";
import NoContent from "@/src/users/components/no-content";
import { useRouter } from "next/navigation";
import { createChat } from "@/src/chats/actions/chats-action";
import useSessionStore from "@/src/common/stores/session-store";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ChatUsersModal = ({
  children,
  onSelect,
  dialogTitle = "New Message",
  confirmButtonText = "Continue",
  usersToExclude = [],
  multiSelect = false,
  loading,
  groupCreate = false,
  searchInputLabel = "To",
}: PropsWithChildren & {
  onSelect?: (
    users: string[],
    values?: { name: string; description?: string }
  ) => Promise<void>;
  loading?: boolean;
  dialogTitle?: string;
  confirmButtonText?: string;
  usersToExclude?: string[];
  multiSelect?: boolean;
  groupCreate?: boolean;
  searchInputLabel?: string;
}) => {
  const qc = useQueryClient();

  const router = useRouter();
  const userId = useSessionStore((s) => s.user?.id);
  const [open, setOpen] = useState(false);
  const [debouncedValue, setDebouncedValue] = useDebounceValue("", 1000);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState({
    name: "",
    description: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["chat-users-search", debouncedValue],
    queryFn: async () => {
      const { data, message } = await getUsers({
        search: debouncedValue,
      });
      if (message) toast.error(message);
      return data;
    },
  });

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

  const usersAfterExcluding = useMemo(
    () =>
      data?.items.filter(
        (user) => user.id !== userId && !usersToExclude.includes(user.id)
      ),
    [data, userId, usersToExclude]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md py-4 px-0 gap-0">
        <DialogHeader className="px-4 border-b pb-4">
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div>
          {groupCreate && (
            <div className="space-y-4 px-4 py-2 border-b">
              <div className="space-y-1">
                <Label htmlFor="name" className="font-semibold">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter group name..."
                  value={value.name}
                  autoFocus
                  onChange={(e) =>
                    setValue((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="desc" className="font-semibold">
                  Description{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Textarea
                  id="desc"
                  rows={4}
                  maxLength={800}
                  placeholder="Enter group description..."
                  className="resize-none"
                  value={value.description}
                  onChange={(e) =>
                    setValue((p) => ({ ...p, description: e.target.value }))
                  }
                />
                <div className="ml-auto w-fit text-xs text-muted-foreground">
                  {value.description?.length}/800
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 border-b">
            <p className="font-bold min-w-fit">{searchInputLabel}:</p>
            <Input
              placeholder="Search..."
              className="border-0 outline-none focus-visible:ring-0"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setDebouncedValue(e.target.value);
              }}
            />
            {search.length > 0 && (
              <X
                className="size-4"
                onClick={() => {
                  setSearch("");
                  setDebouncedValue("");
                }}
              />
            )}
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
            ) : !usersAfterExcluding?.length ? (
              <div className="p-2">
                <NoContent
                  icon={User}
                  title="No users found"
                  subtitle="Try searching with a different keyword"
                />
              </div>
            ) : (
              <div className="flex flex-col">
                {usersAfterExcluding?.map((user) => {
                  const isChecked = selectedUsers.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 hover:bg-accent transition-colors cursor-pointer",
                        { "gap-4": multiSelect }
                      )}
                      onClick={async () => {
                        if (multiSelect) {
                          setSelectedUsers((u) => {
                            if (!isChecked) {
                              return [...u, user.id];
                            }
                            return u.filter((id) => id !== user.id);
                          });
                        } else if (onSelect) {
                          await onSelect([user.id]);
                          setOpen(false);
                        } else {
                          handleUserSelect(user.id);
                        }
                      }}
                    >
                      {multiSelect && <Checkbox checked={isChecked} />}
                      <UserChip noLink user={user} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {multiSelect && (
          <DialogFooter className="px-4 pt-4">
            <Button
              loading={loading}
              onClick={async () => {
                if (groupCreate) {
                  if (!value.name.trim())
                    return toast.error("Group name is required!");
                }
                await onSelect?.(selectedUsers, value);
                setOpen(false);
              }}
              endContent={<ArrowRight className="size-4" />}
              disabled={!selectedUsers.length}
              className="w-full"
              variant="info"
            >
              {confirmButtonText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatUsersModal;
