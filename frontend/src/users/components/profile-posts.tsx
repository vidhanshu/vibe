"use client";

import CreatePostModal from "@/src/common/components/modals/create-post-modal/create-post-modal";
import ViewPostModal from "@/src/common/components/modals/view-post-modal";
import useSessionStore from "@/src/common/stores/session-store";
import { getPosts, getSavedPosts } from "@/src/posts/actions/posts-actions";
import { NSPost } from "@/src/posts/types";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import NoContent from "./no-content";
import useInfinite from "@/src/common/hooks/use-infinite";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePosts = () => {
  const params = useParams();
  const sp = useSearchParams();
  const pathname = usePathname();

  const saved = pathname.includes("/saved");

  const { user } = useSessionStore();
  const { data, isLoading, ref } = useInfinite({
    fetcher: saved
      ? getSavedPosts
      : // eslint-disable-next-line
        (props: any) =>
          getPosts({ ...props, username: params.username as string }),
    queryKey: saved ? ["saved-posts"] : ["posts"],
  });

  const isSelf = params?.username === user?.username;
  const allData = useMemo(() => data?.map((data) => data.items).flat(), [data]);

  const postId = sp.get("postId");

  return (
    <div>
      {isLoading ? (
        <div className="grid px-4 md:px-0 md:grid-cols-3 gap-4">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
      ) : allData?.length ? (
        <div className="grid px-4 md:px-0 md:grid-cols-3 gap-4">
          {allData.map((item) => (
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
            : saved
            ? {
                title: "No saved posts",
                subtitle: "",
              }
            : {})}
        >
          {isSelf && !saved && (
            <CreatePostModal asChild>
              <button className="text-blue-500">Share photos</button>
            </CreatePostModal>
          )}
        </NoContent>
      )}
      {postId ? <ViewPostModal open postId={postId} /> : null}
      <div ref={ref} />
    </div>
  );
};

export default ProfilePosts;

const ProfilePostCard = ({ post }: { post: NSPost.Post }) => {
  const param = useParams();
  const pathname = usePathname();
  const saved = pathname.includes("/saved");

  return (
    <Link
      href={`/users/${param.username}${saved ? "/saved" : ""}?postId=${
        post.id
      }`}
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
