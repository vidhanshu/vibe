import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import useSessionStore from "@/src/common/stores/session-store";
import { getShortRelativeTime } from "@/src/common/utils/dayjs";
import { NSPost } from "@/src/posts/types";
import Link from "next/link";
import { ConfirmationModal } from "../confirmation-modal";

const Comment = ({
  content,
  createdAt,
  id,
  user,
  editCommentId,
  updatedAt,
  setEditCommentId,
  handleDeleteComment,
  isDeletingComment,
}: NSPost.Comment & {
  setEditCommentId: (id: string | null) => void;
  editCommentId: string | null;
  handleDeleteComment: (id: string) => void;
  isDeletingComment: boolean;
}) => {
  const currentUserId = useSessionStore((select) => select.user?.id);

  return (
    <div className="flex gap-x-4">
      <UserAvatar username={user?.username} url={user.profilePhoto} />
      <div className="space-y-2">
        <div>
          <Link
            href={`/users/${user.username}`}
            className="font-bold hover:cursor-pointer"
          >
            {user.username}
          </Link>
          {createdAt !== updatedAt && (
            <span className="text-xs text-muted-foreground ml-2">(edited)</span>
          )}
        </div>
        <p className="text-sm">{content}</p>
        <div className="flex gap-x-4 items-center">
          <p className="text-xs text-muted-foreground font-bold">
            {getShortRelativeTime(createdAt!)}
          </p>
          {user.id === currentUserId && (
            <>
              <button
                onClick={setEditCommentId.bind(
                  null,
                  editCommentId === id ? null : id
                )}
                className={cn("text-blue-500 text-xs font-bold")}
              >
                {editCommentId === id ? "Cancel" : "Edit"}
              </button>
              <ConfirmationModal onConfirm={() => handleDeleteComment(id)}>
                <button
                  disabled={isDeletingComment}
                  className={cn(
                    "text-rose-500 text-xs font-bold",
                    isDeletingComment &&
                      "text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Delete
                </button>
              </ConfirmationModal>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
