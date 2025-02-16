"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/src/auth/components/user-avatar";
import { getUsers } from "@/src/users/actions/user-actions";
import NoContent from "@/src/users/components/no-content";
import { NSUser } from "@/src/users/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceValue, useLocalStorage } from "usehooks-ts";

const SearchDrawer = ({ closeCollapse }: { closeCollapse: () => void }) => {
  const [debounced, updateDebounced] = useDebounceValue("", 1000);
  const [recentSearches, setRecentSearches] = useLocalStorage<NSUser.User[]>(
    "recent-searches",
    []
  );

  const qc = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["search"],
    queryFn: async () => {
      setIsLoading(true);
      const { data, message } = await getUsers({
        search: debounced,
      });
      setIsLoading(false);
      if (message) toast.error(message);
      return data;
    },
  });

  useEffect(() => {
    if (!debounced.trim().length) {
      qc?.setQueryData(["search"], null); // Set data to null
      return;
    }
    setIsLoading(true);
    refetch().finally(() => {
      setIsLoading(false);
    });
  }, [debounced, qc]);

  return (
    <>
      <div className="px-6 mb-6">
        <h1 className="font-bold text-2xl">Search</h1>
      </div>
      <div className="px-6">
        <Input
          autoFocus
          onChange={(e) => updateDebounced(e.target.value)}
          type="search"
          placeholder="Search"
        />
      </div>
      <Separator className="mt-6" />
      <div className="px-6">
        {!debounced.trim().length ? (
          <>
            {recentSearches.length ? (
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="mt-4 font-bold text-sm text-muted-foreground">
                    Recent searches
                  </h1>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-blue-500 font-bold text-sm"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-4 mt-6">
                  {recentSearches.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between"
                    >
                      <Link
                        onClick={closeCollapse}
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
                      <X
                        className="size-4 cursor-pointer"
                        onClick={() =>
                          setRecentSearches((rs) =>
                            rs.filter((s) => s.id !== user.id)
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 text-muted-foreground">
                <p>Type something to search...</p>
              </div>
            )}
          </>
        ) : isLoading ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ) : !data?.items?.length && debounced.trim().length ? (
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
              onClick={() => {
                closeCollapse();
                setRecentSearches((prev) => {
                  if (prev.some((u) => u.id === user.id)) return prev;
                  return [...prev, user];
                });
              }}
              href={`/users/${user.username}`}
              className={`px-6 py-4`}
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
    </>
  );
};

export default SearchDrawer;
