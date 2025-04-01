import { Separator } from "@/components/ui/separator";
import useInfinite from "../../hooks/use-infinite";
import { getNotifications } from "../../actions/notifications-actions";
import { useEffect } from "react";
import { NSCommon } from "../../types";
import UserAvatar from "@/src/auth/components/user-avatar";
import Image from "next/image";
import { Bell, Heart, Loader2 } from "lucide-react";
import { getShortRelativeTime } from "../../utils/dayjs";
import useSessionStore from "../../stores/session-store";
import Link from "next/link";
import Button from "@/components/ui/button";
import useFollow from "@/src/users/hooks/use-follow";
import { useParams } from "next/navigation";
import UserChipSkeleton from "../skeletons/user-chip-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationContext } from "../../contexts/notification-context";
import NoContent from "@/src/users/components/no-content";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUploadStore } from "../../stores/upload-store";
import { cn } from "@/lib/utils";

const NotificationDrawer = ({ closeDrawer }: { closeDrawer: () => void }) => {
  const { notifications, setNotifications } = useNotificationContext();
  const { ref, isFetchingNextPage, isLoading, data } = useInfinite({
    queryKey: ["notifications"],
    fetcher: getNotifications,
  });

  useEffect(() => {
    setNotifications(
      data?.map((data) => data.items).flat() as NSCommon.Notification[]
    );
  }, [data, setNotifications]);

  return (
    <>
      <div className="flex flex-col h-screen max-h-screen">
        <div className="px-6">
          <h1 className="font-bold text-2xl">Notifications</h1>
        </div>
        <Separator className="my-6" />
        {/* Ensure this div expands properly */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-165px)] md:max-h-[calc(100vh-125px)]">
          {" "}
          {/* This is the key change */}
          {isLoading ? (
            <div className="space-y-4 px-6">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex gap-x-4 items-center">
                  <UserChipSkeleton className="w-full" />
                  <Skeleton className="w-8 h-8" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <NoContent
              icon={Bell}
              title="No notifications"
              subtitle="There are no notifications for you"
            />
          ) : (
            <div>
              {notifications.map((item, idx) => {
                return (
                  <NotificationItem
                    closeDrawer={closeDrawer}
                    notification={item}
                    key={`${item.id}-${idx}`}
                  />
                );
              })}
              {isFetchingNextPage && (
                <Loader2 className="size-6 animate-spin mx-auto" />
              )}
              <div ref={ref} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;

const NotificationItem = ({
  notification: {
    byUser,
    byUserId,
    type,
    post,
    createdAt,
    postId,
    comment,
    commentId,
  },
  closeDrawer,
}: {
  notification: NSCommon.Notification;
  closeDrawer: () => void;
}) => {
  const { user } = useSessionStore();
  const username = useParams().username as string;
  const { handleFollowUnfollow, isPending } = useFollow({
    queryKesToInvalidate: [
      ["notifications"],
      ...[username ? ["profile", username] : []],
    ],
    follows: byUser.follows,
  });
  const mediaToShow =
    (type === "LIKE" || type === "COMMENT") && post ? post?.medias[0] : null;
  const link =
    (type === "LIKE" || type === "COMMENT") && postId
      ? `/users/${user?.username}?postId=${postId}${
          type === "COMMENT" && commentId ? `&commentId=${commentId}` : ""
        }`
      : type === "FOLLOW" && byUser
      ? `/users/${byUser.username}`
      : null;

  const content = (
    <>
      <div className="flex gap-x-4 items-center">
        <UserAvatar
          url={byUser.profilePhoto?.url}
          username={byUser.username}
          className="size-10"
        />
        <div>
          <p className="text-sm">
            <b>{byUser.username}</b>&nbsp;
            <span>
              {type === "LIKE" ? (
                "liked your post"
              ) : type === "COMMENT" ? (
                <>
                  Commented on your post:&nbsp;
                  {comment ? (
                    comment.content.slice(0, 30)
                  ) : (
                    <span className="italic line-through">
                      {" "}
                      comment deleted
                    </span>
                  )}
                </>
              ) : type === "FOLLOW" ? (
                <>Started following you</>
              ) : null}
            </span>
          </p>
          <p className="text-sm font-bold text-muted-foreground">
            {getShortRelativeTime(createdAt)}
          </p>
        </div>
      </div>
    </>
  );

  if (link)
    return (
      <div className="flex gap-x-4 justify-between items-center w-full hover:bg-secondary/40 px-6 py-2">
        <Link
          href={link}
          onClick={closeDrawer}
          className="flex gap-x-4 justify-between items-center w-full"
        >
          {content}
          {mediaToShow && (
            <div className="size-[40px] min-w-[40px] relative">
              {mediaToShow.mediaType === "IMAGE" ? (
                <Image
                  src={mediaToShow.url}
                  alt="media-file"
                  width={40}
                  height={40}
                  className="rounded-md h-[40px] object-cover object-center"
                />
              ) : (
                <video
                  className="rounded-md size-[40px] object-cover"
                  src={mediaToShow.url}
                />
              )}
            </div>
          )}
        </Link>
        {type === "FOLLOW" && (
          <Button
            onClick={() =>
              handleFollowUnfollow({
                userId: byUserId,
                username: byUser.username,
              })
            }
            loading={isPending}
            size="xs"
            variant={byUser.follows ? "secondary" : "default"}
          >
            {byUser.follows ? "Following" : "Follow"}
          </Button>
        )}
      </div>
    );

  return (
    <div
      onClick={closeDrawer}
      className="flex gap-x-4 justify-between items-center w-full hover:bg-secondary/40 px-6 py-2"
    >
      {content}
      {type === "FOLLOW" && <Button>Follow</Button>}
      {mediaToShow && (
        <div className="size-[40px] min-w-[40px] relative">
          {mediaToShow.mediaType === "IMAGE" ? (
            <Image
              src={mediaToShow.url}
              alt="media-file"
              width={40}
              height={40}
              className="rounded-md h-[40px] object-cover object-center"
            />
          ) : (
            <video className="rounded-md full" src={mediaToShow.url} />
          )}
        </div>
      )}
    </div>
  );
};

export const MobileNotificationSheet = () => {
  const { uploads } = useUploadStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="min-w-10 relative"
          endContent={
            <>
              <Heart className="size-6" />
              {uploads.length > 0 && (
                <div className="size-2 absolute top-2 right-2 bg-rose-500 rounded-full" />
              )}
            </>
          }
        />
      </SheetTrigger>
      <SheetContent className="w-full px-0">
        <SheetHeader className="hidden">
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        {uploads.length > 0 && (
          <div className="absolute bottom-4 left-4 space-y-2">
            {uploads.map(({ id, status }) => {
              const isStatus = id.startsWith("status-");
              return (
                <div
                  key={id}
                  className={cn(
                    "flex items-center gap-2 text-sm px-2 py-1 rounded-sm",
                    {
                      "bg-yellow-950": status === "uploading",
                      "bg-green-950": status === "completed",
                      "bg-rose-950": status === "failed",
                    }
                  )}
                >
                  <span>
                    {status === "uploading"
                      ? `${isStatus ? "Status" : "Post"} uploading...`
                      : status === "failed"
                      ? `Failed adding ${isStatus ? "status" : "post"} ❌`
                      : `Added ${isStatus ? "status" : "post"} ✅`}
                  </span>
                  {status === "uploading" && (
                    <div className="size-5 flex items-center justify-center">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <NotificationDrawer closeDrawer={() => {}} />
      </SheetContent>
    </Sheet>
  );
};
