"use client";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import FollowersFollowingsModal from "@/src/common/components/modals/followers-followings-modal";
import useSessionStore from "@/src/common/stores/session-store";
import { getShortNumber } from "@/src/common/utils/number";
import { getUserByUsername } from "@/src/users/actions/user-actions";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Grid3X3, Youtube } from "lucide-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { toast } from "sonner";
import ProfileHeaderSkeleton from "./skeletons/profile-header-skeleton";
import StatusViewDrawer from "@/src/feed/components/status/status-view-drawer";
import useFollow from "../hooks/use-follow";
import { createChat } from "@/src/chats/actions/chats-action";
import LogoutButton from "@/src/auth/components/logout-btn";

const PRONOUN_MAP = {
  he: "he/his",
  she: "she/her",
  they: "they/them",
};

const ProfileHeader = () => {
  const params = useParams();
  const router = useRouter();
  const sp = useSearchParams();
  const isOpen = sp.get("status") === "open";
  const pathname = usePathname()?.split("?")[0];
  const { user, isLoading } = useSessionStore();

  const { data, isLoading: isUserLoading } = useQuery({
    queryKey: ["profile", params.username],
    queryFn: () => getUserByUsername(params.username as string),
  });
  const { handleFollowUnfollow } = useFollow({
    follows: data?.data?.follows,
    queryKesToInvalidate: [
      ["profile", params.username as string],
      ["followers"],
    ],
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
  ];

  const handleUserSelect = async () => {
    if (!currentUser?.id) return;

    const res = await createChat({
      chatType: "DM",
      participantId: currentUser.id,
    });

    if (res.data?.id) {
      router.push(`/chats/${res.data.id}`);
    } else if (res.message) {
      toast.error(res.message);
    }
  };

  return (
    <>
      {currentUser?.status && (
        <StatusViewDrawer
          close={() => {
            router.push(pathname.split("?")[0]);
          }}
          statuses={[currentUser.status]}
          setViewStatusIdx={() => {}}
          viewStatusIdx={isOpen ? 0 : null}
        />
      )}
      <div className="px-4 md:px-0 flex flex-col gap-y-4 md:flex-row gap-x-4 md:gap-x-16 max-w-[700px] mx-auto">
        <div
          onClick={() => {
            router.push(`${pathname}?status=open`);
          }}
          className={cn(
            currentUser?.status
              ? currentUser.status.viewed
                ? "rounded-full p-1 cursor-pointer bg-secondary"
                : "insta-bg rounded-full p-1 cursor-pointer"
              : ""
          )}
        >
          <UserAvatar
            username={currentUser?.username}
            fallbackClassName="text-4xl md:text-6xl font-bold"
            url={currentUser?.profilePhoto?.url}
            className="size-28 md:size-40 border-4 border-black"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between py-2 gap-2">
          <div className="flex gap-x-4 items-center">
            <div className="">
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
              <p className="font-bold text-muted-foreground">
                {currentUser?.name}
              </p>
            </div>
            {!isUserSelf && (
              <Button
                onClick={() =>
                  data?.data?.id &&
                  handleFollowUnfollow({ userId: data.data.id })
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
            {isUserSelf ? (
              <>
                <Link href="/users/accounts/edit">
                  <Button
                    className="font-semibold"
                    variant="secondary"
                    size="sm"
                  >
                    Edit profile
                  </Button>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Button
                onClick={handleUserSelect}
                className="font-semibold"
                variant="secondary"
                size="sm"
              >
                Message
              </Button>
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
            <h1 className="text-sm font-bold md:text-base">
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
          <div>
            {data?.data?.followers?.length ? (
              <FollowersFollowingsModal forFollowers={false} id={data.data.id}>
                <p className="text-sm cursor-pointer">
                  <span className="font-bold text-muted-foreground">
                    Followed by&nbsp;
                  </span>
                  {data.data.followers
                    .map(({ follower }) => follower.username)
                    .join(", ")}
                  {data.data._count.followers - data.data.followers.length >
                  0 ? (
                    <span className="font-bold text-muted-foreground">
                      &nbsp;and&nbsp;
                      {data.data._count.followers - data.data.followers.length}
                      &nbsp;more
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </FollowersFollowingsModal>
            ) : (
              ""
            )}
          </div>
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
