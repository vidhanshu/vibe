"use client";

import { useParams } from "next/navigation";
import NoContent from "./no-content";
import CreatePostModal from "@/src/common/components/modals/create-post-modal";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/src/posts/actions/posts-actions";
import { toast } from "sonner";

const ProfilePosts = () => {
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

  return (
    <div>
      {data?.data?.items?.length ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <NoContent>
          <CreatePostModal asChild>
            <button className="text-blue-500">Share photos</button>
          </CreatePostModal>
        </NoContent>
      )}
    </div>
  );
};

export default ProfilePosts;
