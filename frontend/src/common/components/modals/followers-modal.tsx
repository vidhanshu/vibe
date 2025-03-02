import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/src/auth/components/user-avatar";
import { getFollowers } from "@/src/users/actions/follow-actions";
import NoContent from "@/src/users/components/no-content";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, X } from "lucide-react";
import Link from "next/link";
import React, { PropsWithChildren, useEffect } from "react";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

const FollowersModal = ({
  id,
  children,
}: { id: string } & PropsWithChildren) => {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = useDebounceValue("", 1000);

  const [isLoading, setIsLoading] = React.useState(false);
  const { refetch, data } = useQuery({
    queryKey: ["followers"],
    queryFn: async () => {
      setIsLoading(true);
      const res = await getFollowers({ id, search });
      if (res.message) {
        toast.error(res.message);
        setIsLoading(false);
        return null;
      }
      setIsLoading(false);
      return res.data;
    },
  });

  useEffect(() => {
    if (!search.trim().length) {
      qc?.setQueryData(["search"], null); // Set data to null
      return;
    }
    setIsLoading(true);
    refetch().finally(() => {
      setIsLoading(false);
    });
  }, [search, qc, refetch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="bg-neutral-800 p-0 gap-2 max-w-[400px]"
        hideCloseBtn
      >
        <DialogHeader className="border-b border-white/10 p-2 relative">
          <DialogTitle className="text-center">Followers</DialogTitle>
          <X
            className="absolute size-6 top-0 right-4 cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </DialogHeader>
        <div className="px-4 pb-4">
          <Input
            sizeVariant="sm"
            className="bg-neutral-700 mb-2"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="px-4 py-2 space-y-2">
            {isLoading ? (
              <div className="space-y-4 mt-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : !data?.items?.length && search.trim().length ? (
              <div className="py-16">
                <NoContent
                  titleClassName="text-xl"
                  iconContainerClassName="size-10"
                  icon={User}
                  title="No users found"
                  subtitle=""
                />
              </div>
            ) : (
              data?.items?.map((user) => (
                <Link
                  key={user.id}
                  onClick={() => {}}
                  href={`/users/${user.username}`}
                >
                  <div className="flex gap-x-4 items-center">
                    <UserAvatar
                      className="size-8"
                      url={user.profilePhoto?.url}
                      username={user.username}
                    />
                    {user.username}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersModal;
