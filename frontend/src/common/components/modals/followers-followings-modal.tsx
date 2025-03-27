import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getFollowers,
  getFollowings,
} from "@/src/users/actions/follow-actions";
import NoContent from "@/src/users/components/no-content";
import { Loader2, User, X } from "lucide-react";
import React, { PropsWithChildren, useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";
import UserChip from "../user-chip";
import useInfinite from "../../hooks/use-infinite";

const FollowersFollowingsModal = ({
  id,
  children,
  forFollowers = true,
}: { id: string; forFollowers?: boolean } & PropsWithChildren) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = useDebounceValue("", 1000);

  const { data, isLoading, ref, isFetchingNextPage } = useInfinite({
    queryKey: [forFollowers ? "followers" : "followings", search],
    fetcher: (props: { page: number }) =>
      forFollowers
        ? getFollowers({ id, search, ...props })
        : getFollowings({ id, search, ...props }),
  });

  const allData = useMemo(() => {
    return data.map((data) => data.items).flat();
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="bg-neutral-800 p-0 gap-2 max-w-[400px]"
        hideCloseBtn
      >
        <DialogHeader className="border-b border-white/10 p-2 relative">
          <DialogTitle className="text-center">
            {forFollowers ? "Followers" : "Followings"}
          </DialogTitle>
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
          <div className="px-4 py-2 space-y-2 max-h-[70vh] overflow-y-auto">
            {isLoading ? (
              <div className="space-y-4 mt-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : !allData?.length && search.trim().length ? (
              <div className="py-16">
                <NoContent
                  titleClassName="text-xl"
                  iconContainerClassName="size-10"
                  icon={User}
                  title="No users found"
                  subtitle=""
                />
              </div>
            ) : !allData?.length ? (
              <NoContent
                titleClassName="text-xl"
                iconContainerClassName="size-10"
                icon={User}
                title={`No ${forFollowers ? "followers" : "followings"} found`}
                subtitle=""
              />
            ) : (
              allData?.map((user) => (
                <UserChip key={user.id} user={user} size="sm" />
              ))
            )}
            <div ref={ref} />
            {isFetchingNextPage && (
              <Loader2 className="mx-auto size-6 animate-spin" />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersFollowingsModal;
