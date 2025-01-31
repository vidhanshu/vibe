"use client";

import Button from "@/components/ui/button";
import UserAvatar from "@/src/auth/components/user-avatar";
import useSessionStore from "@/src/common/stores/session-store";
import {
  Bookmark,
  Grid3X3,
  MoreHorizontal,
  Settings,
  Tag,
  UserPlus2,
  Youtube,
} from "lucide-react";
import { getUserByUsername } from "@/src/users/actions/user-actions";
import ProfileHeaderSkeleton from "./skeletons/profile-header-skeleton";
import { useParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PRONOUN_MAP = {
  he: "he/his",
  she: "she/her",
  they: "they/them",
};

const ProfileHeader = () => {
  const params = useParams();
  const pathname = usePathname()?.split("?")[0];
  const { user, isLoading } = useSessionStore();

  const { data, isLoading: isUserLoading } = useQuery({
    queryKey: ["profile", params.username],
    queryFn: () => getUserByUsername(params.username as string),
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
    {
      icon: Tag,
      href: `/users/${params.username}/tagged`,
      name: "Tagged",
    },
  ];

  return (
    <>
      <div className="flex gap-x-16 max-w-[700px] mx-auto">
        <UserAvatar
          username={currentUser?.username}
          fallbackClassName="text-6xl font-bold"
          url={currentUser?.profilePhoto?.url}
          className="size-40"
        />
        <div className="flex-1 flex flex-col justify-between py-2">
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
              <Button className="font-semibold" variant="default" size="sm">
                Follow
              </Button>
            )}
            {isUserSelf && (
              <Button className="font-semibold" variant="secondary" size="sm">
                Edit profile
              </Button>
            )}
            {!isUserSelf && (
              <Button size="icon-sm" variant="secondary" className="rounded-md">
                <UserPlus2 className="size-5" />
              </Button>
            )}
            {!isUserSelf && (
              <Button size="icon-sm" variant="ghost" className="rounded-md">
                <MoreHorizontal className="size-5" />
              </Button>
            )}
            {isUserSelf && (
              <Button size="icon" variant="ghost">
                <Settings className="size-6" />
              </Button>
            )}
          </div>
          <div className="flex justify-between items-center text-lg max-w-[300px]">
            <h1>
              <b>{currentUser?._count.posts}</b> Posts
            </h1>
            <h1>
              <b>{currentUser?._count.followers}</b> Followers
            </h1>
            <h1>
              <b>{currentUser?._count.followings}</b> Followings
            </h1>
          </div>
          <p>{currentUser?.bio}</p>
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
