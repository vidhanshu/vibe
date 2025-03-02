import Button from "@/components/ui/button";
import UserAvatar from "@/src/auth/components/user-avatar";
import ViewPostModal from "@/src/common/components/modals/view-post-modal";
import PostFooter from "@/src/common/components/modals/view-post-modal/post-footer";
import PostMediaCarousel from "@/src/common/components/modals/view-post-modal/post-media-carousel";
import useSessionStore from "@/src/common/stores/session-store";
import { getShortRelativeTime } from "@/src/common/utils/dayjs";
import { NSPost } from "@/src/posts/types";
import {
  Ellipsis,
  Paperclip,
  Pencil,
  Share,
  SquareX,
  Star,
  Trash,
  UserMinus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FeedPostCard = (detailedPost: NSPost.DetailedPost) => {
  const { id, createdAt, medias, title, user } = detailedPost;
  // const router = useRouter();
  const [open, setOpen] = useState(false);
  const currentUserId = useSessionStore((select) => select.user?.id);
  const [comment, setComment] = useState("");
  // const sp = useSearchParams();
  // const postId = sp.get("postId");
  const [editCommentId, setEditCommentId] = useState<string | null>(null);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2 items-center">
            <Link
              href={`/users/${user.username}`}
              className="flex gap-x-2 items-center"
            >
              <UserAvatar
                className="size-8"
                fallbackClassName="text-2xl"
                url={user?.profilePhoto?.url}
                username={user?.username}
              />
              <span className="font-bold">{user?.username}</span>
            </Link>
            <p className="font-bold text-muted-foreground text-sm">
              {" "}
              . {getShortRelativeTime(createdAt)}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-xs" variant="ghost">
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Post options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user?.id !== currentUserId ? (
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-rose-500">
                    <SquareX />
                    <span>Report</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-rose-500">
                    <UserMinus />
                    <span>Unfollow</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuItem className="text-blue-500">
                    <Pencil />
                    <span>Edit post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-rose-500">
                    <Trash />
                    <span>Delete post</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {user?.id !== currentUserId && (
                  <DropdownMenuItem>
                    <Star />
                    <span>Add to favorites</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Share />
                  <span>Share to...</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Paperclip />
                  <span>Copy link</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="border h-[585px] flex items-center justify-center">
          <PostMediaCarousel
            containerClassName="flex-1"
            imageClassName="w-full max-h-[585px]"
            videoClassName="max-h-[585px] w-auto max-w-sm"
            title={title}
            medias={medias}
          />
        </div>
        {detailedPost && (
          <PostFooter
            autoFocusComment={false}
            variant="feed"
            comment={comment}
            setComment={setComment}
            editCommentId={editCommentId}
            setEditCommentId={setEditCommentId}
            post={detailedPost}
            onCommentClick={() => {
              setOpen(true);
            }}
          />
        )}
      </div>
      {open && (
        <ViewPostModal
          skipPostFetch
          open={open}
          setOpen={setOpen}
          postId={id}
        />
      )}
    </>
  );
};

export default FeedPostCard;
