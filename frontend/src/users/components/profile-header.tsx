"use client";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import FollowersFollowingsModal from "@/src/common/components/modals/followers-followings-modal";
import useSessionStore from "@/src/common/stores/session-store";
import { getShortNumber } from "@/src/common/utils/number";
import { getUserByUsername } from "@/src/users/actions/user-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Grid3X3, Youtube } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { followUnfollow } from "../actions/follow-actions";
import ProfileHeaderSkeleton from "./skeletons/profile-header-skeleton";

const PRONOUN_MAP = {
  he: "he/his",
  she: "she/her",
  they: "they/them",
};

const ProfileHeader = () => {
  const params = useParams();
  const qc = useQueryClient();
  const pathname = usePathname()?.split("?")[0];
  const { user, isLoading } = useSessionStore();

  const { data, isLoading: isUserLoading } = useQuery({
    queryKey: ["profile", params.username],
    queryFn: () => getUserByUsername(params.username as string),
  });

  const { mutate: handleFollowUnfollow } = useMutation({
    mutationKey: ["follows"],
    mutationFn: async (userId: string) => {
      const res = await followUnfollow(userId);
      if (res.message) {
        toast.error(res.message);
      } else {
        toast.success(
          `${data?.data?.follows ? "Unfollowed" : "Followed"} successfully`
        );
        qc.invalidateQueries({ queryKey: ["profile", params.username] });
        qc.invalidateQueries({ queryKey: ["followers"] });
      }
      return res.data;
    },
  });

  if (isLoading || isUserLoading) {
    return <ProfileHeaderSkeleton />;
  }

  const isUserSelf = user?.username === params.username;
  const currentUser = data?.data;

  const TABS = [
    {
      icon: Grid3X3,
      href: `/users/${params.username}`,
      name: "Posts",
    },
    ...(isUserSelf
      ? [
          {
            icon: Bookmark,
            href: `/users/${params.username}/saved`,
            name: "Saved",
          },
        ]
      : []),
    {
      icon: Youtube,
      href: `/users/${params.username}/reels`,
      name: "Reels",
    },
    // {
    //   icon: Tag,
    //   href: `/users/${params.username}/tagged`,
    //   name: "Tagged",
    // },
  ];

  return (
    <>
      <div className="px-4 md:px-0 flex gap-x-4 md:gap-x-16 max-w-[700px] mx-auto">
        <UserAvatar
          username={currentUser?.username}
          fallbackClassName="text-4xl md:text-6xl font-bold"
          url={currentUser?.profilePhoto?.url}
          className="size-28 md:size-40"
        />
        <div className="flex-1 flex flex-col justify-between py-2 gap-2">
          <div className="flex gap-x-4 items-center">
            <p className="text-2xl">
              {currentUser?.username}
              {currentUser?.pronoun && (
                <>
                  .{" "}
                  <span className="text-muted-foreground text-lg">
                    {
                      PRONOUN_MAP[
                        currentUser?.pronoun as keyof typeof PRONOUN_MAP
                      ]
                    }
                  </span>
                </>
              )}
            </p>
            {!isUserSelf && (
              <Button
                onClick={() =>
                  data?.data?.id && handleFollowUnfollow(data.data.id)
                }
                className={cn(
                  "font-semibold",
                  data?.data?.follows && "bg-blue-500 hover:bg-blue-600"
                )}
                variant="default"
                size="sm"
              >
                {data?.data?.follows ? "Unfollow" : "Follow"}
              </Button>
            )}
            {isUserSelf && (
              <Link href="/users/accounts/edit">
                <Button className="font-semibold" variant="secondary" size="sm">
                  Edit profile
                </Button>
              </Link>
            )}
            {/* {!isUserSelf && (
              <Button size="icon-sm" variant="secondary" className="rounded-md">
                <UserPlus2 className="size-5" />
              </Button>
            )}
            {!isUserSelf && (
              <Button size="icon-sm" variant="ghost" className="rounded-md">
                <MoreHorizontal className="size-5" />
              </Button>
            )} */}
            {/* {isUserSelf && (
              <Button size="icon" variant="ghost">
                <Settings className="size-6" />
              </Button>
            )} */}
          </div>
          <div className="flex justify-between items-center text-lg max-w-[300px]">
            <h1 className="text-sm font-bold md:text-base cursor-pointer">
              <b>{currentUser?._count.posts}</b> Posts
            </h1>
            {data?.data?.id && (
              <FollowersFollowingsModal id={data.data.id}>
                <h1 className="text-sm font-bold md:text-base cursor-pointer">
                  <b>{getShortNumber(currentUser?._count.followers ?? 0)}</b>{" "}
                  Followers
                </h1>
              </FollowersFollowingsModal>
            )}
            {data?.data?.id && (
              <FollowersFollowingsModal forFollowers={false} id={data.data.id}>
                <h1 className="text-sm font-bold md:text-base cursor-pointer">
                  <b>{getShortNumber(currentUser?._count.followings ?? 0)}</b>{" "}
                  Followings
                </h1>
              </FollowersFollowingsModal>
            )}
          </div>
          <p
            className="text-sm break-words max-w-xs"
            dangerouslySetInnerHTML={{
              __html: currentUser?.bio?.replaceAll("\n", "<br />") ?? "",
            }}
          />
        </div>
      </div>
      <div className="border-t max-w-[900px] flex justify-center mx-auto">
        <div className="flex items-center justify-center">
          {TABS.map(({ href, icon: Icon, name }, idx) => {
            const isActive = pathname === href;
            return (
              <Link key={idx} href={href}>
                <button
                  className={cn(
                    "px-6 py-2.5 text-muted-foreground font-bold flex items-center gap-x-2",
                    isActive
                      ? "text-white border-t border-white"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" /> {name}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
