"use client";

import CreatePostModal from "@/src/common/components/modals/create-post-modal";
import ViewPostModal from "@/src/common/components/modals/view-post-modal";
import useSessionStore from "@/src/common/stores/session-store";
import { getPosts } from "@/src/posts/actions/posts-actions";
import { NSPost } from "@/src/posts/types";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import NoContent from "./no-content";

const ProfilePosts = () => {
  const { user } = useSessionStore();
  const params = useParams();
  const sp = useSearchParams();
  const { data, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await getPosts({
        username: params.username as string,
      });
      if (res.message) {
        toast.error(res.message);
        return null;
      }
      return res;
    },
  });
  const isSelf = params?.username === user?.username;

  const postId = sp.get("postId");

  return (
    <div>
      {data?.data?.items?.length ? (
        <div className="grid grid-cols-3 gap-4">
          {data.data.items.map((item) => (
            <ProfilePostCard post={item} key={item.id} />
          ))}
        </div>
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
      {postId ? <ViewPostModal postId={postId} /> : null}
    </div>
  );
};

export default ProfilePosts;

const ProfilePostCard = ({ post }: { post: NSPost.Post }) => {
  const param = useParams();
  return (
    <Link
      href={`/users/${param.username}?postId=${post.id}`}
      className="h-[300px] relative z-0 bg-white/10 rounded-md overflow-hidden group"
    >
      {post.medias?.[0]?.url && post.medias?.[0]?.mediaType === "IMAGE" ? (
        <Image
          key={post.id}
          alt={post.title}
          src={post.medias?.[0]?.url}
          fill
          className="object-contain object-center"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="space-y-2">
            <h1 className="font-bold">{post.title}</h1>
            <p className="text-muted-foreground">{post.content}</p>
          </div>
        </div>
      )}

      <div className="hidden group-hover:flex absolute inset-0 bg-black/30 items-center justify-center">
        <div className="flex items-center gap-x-4">
          <div className="flex gap-x-2 items-center text-lg">
            <Heart className="size-6 fill-white" />
            {post._count.likes}
          </div>
          <div className="flex gap-x-2 items-center text-lg">
            <MessageCircle className="size-6 fill-white" />
            {post._count.comments}
          </div>
        </div>
      </div>
    </Link>
  );
};
