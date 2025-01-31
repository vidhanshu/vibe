"use client";

import { useParams } from "next/navigation";
import NoContent from "./no-content";
import CreatePostModal from "@/src/common/components/modals/create-post-modal";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/src/posts/actions/posts-actions";
import { toast } from "sonner";
import useSessionStore from "@/src/common/stores/session-store";

const ProfilePosts = () => {
  const { user } = useSessionStore();
  const params = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await getPosts({ username: params.username as string });
      if (res.message) {
        toast.error(res.message);
        return null;
      }
      return res;
    },
  });
  const isSelf = params?.username === user?.username;

  return (
    <div>
      {data?.data?.items?.length ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <NoContent
          {...(!isSelf
            ? {
                title: "No posts",
                subtitle: "",
                titleClassName: "text-muted-foreground",
              }
            : {})}
        >
          {isSelf && (
            <CreatePostModal asChild>
              <button className="text-blue-500">Share photos</button>
            </CreatePostModal>
          )}
        </NoContent>
      )}
    </div>
  );
};

export default ProfilePosts;
