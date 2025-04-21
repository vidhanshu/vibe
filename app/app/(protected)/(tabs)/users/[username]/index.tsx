import { ButtonText, Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import NoContent from "@/src/common/components/no-content";
import Tabs from "@/src/common/components/tabs";
import useInfinite from "@/src/common/hooks/use-infinite";
import { splitArray } from "@/src/common/utils/array";
import { postService } from "@/src/posts/posts.service";
import { NSPost } from "@/src/posts/types";
import ProfileDetails from "@/src/users/components/profile-details";
import ProfileHeader from "@/src/users/components/profile-header";
import ProfilePostPreview from "@/src/users/components/profile-post-preview";
import ProfilePostRow from "@/src/users/components/profile-post-row";
import useUser from "@/src/users/hooks/use-user";
import { PROFILE_POST_TABS } from "@/src/users/utils/constants";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl } from "react-native";
import { FlatList } from "react-native";

export default function ProfileScreen() {
  const { username } = useLocalSearchParams() as { username: string };
  const [previewPost, setPreviewPost] = useState<NSPost.DetailedPost | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("posts");
  const { user, isUserLoading, isRefetchingUser, refetchUser } = useUser({
    username: username as string,
  });

  const {
    data: posts = [],
    refetch: refetchPosts,
    isLoading: isPostsLoading,
    isRefetching: isRefetchingPosts,
    fetchNextPage: fetchNextPostsPage,
    isFetchingNextPage: isFetchingNextPostsPage,
  } = useInfinite({
    queryKey: ["posts", username],
    fetcher: (props: any) => postService.getPosts({ username, ...props }),
    enabled: !!username,
  });

  const {
    data: savedPosts = [],
    refetch: refetchSavedPosts,
    isLoading: isSavedPostsLoading,
    isRefetching: isRefetchingSavedPosts,
    fetchNextPage: fetchNextSavedPostsPage,
    isFetchingNextPage: isFetchingNextSavedPostsPage,
  } = useInfinite({
    queryKey: ["saved-posts", username],
    fetcher: (props: any) => postService.getSavedPosts({ ...props }),
    enabled: !!username,
  });

  const getData = useCallback(() => {
    switch (activeTab) {
      case "posts":
        return splitArray<NSPost.DetailedPost>(posts);
      case "saved":
        return splitArray<NSPost.DetailedPost>(savedPosts);
      default:
        return [];
    }
  }, [activeTab, posts, savedPosts]);

  const onRefresh = () => {
    refetchUser();
    refetchPosts();
    refetchSavedPosts();
  };

  // to remove flicker, while first time profile tab click by user
  if (!username || isUserLoading)
    return (
      <ActivityIndicator color="white" size="large" className="mx-auto my-16" />
    );
  return (
    <>
      <FlatList
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={
              isRefetchingPosts || isRefetchingSavedPosts || isRefetchingUser
            }
          />
        }
        data={getData()}
        className="flex-1"
        keyExtractor={(item) => item[0].id.toString()}
        onEndReached={() => {
          if (activeTab === "posts") {
            console.log("[fetchNextPosts]");
            fetchNextPostsPage();
          }
          if (activeTab === "saved") {
            console.log("[fetchNextSavedPosts]");
            fetchNextSavedPostsPage();
          }
        }}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <VStack space="lg" className="border h-fit">
            <ProfileHeader username={user?.username ?? "Vibe"} />
            <ProfileDetails isLoading={isUserLoading} user={user} />
            <Tabs
              className="h-fit"
              active={activeTab}
              setActive={setActiveTab}
              tabs={PROFILE_POST_TABS({
                curUsername: user?.username ?? "",
                username: username as string,
              })}
            />
          </VStack>
        }
        ListFooterComponent={
          isFetchingNextPostsPage || isFetchingNextSavedPostsPage ? (
            <ActivityIndicator color="white" size="large" className="my-4" />
          ) : isPostsLoading && activeTab === "posts" ? (
            <ActivityIndicator color="white" size="large" className="my-4" />
          ) : isSavedPostsLoading && activeTab === "saved" ? (
            <ActivityIndicator color="white" size="large" className="my-4" />
          ) : null
        }
        ListEmptyComponent={
          activeTab === "reels" ? (
            <NoContent title="This feature yet to be implemented" />
          ) : activeTab === "posts" ? (
            <NoContent
              title="No Posts"
              description="There are no posts, once you create they'll appear here."
              extras={
                <Button size="sm">
                  <ButtonText>Create</ButtonText>
                  <AntDesign name="plus" size={16} color="white" />
                </Button>
              }
            />
          ) : (
            <NoContent title="No saved posts" />
          )
        }
        renderItem={({ item: postSplit }) => {
          return (
            <ProfilePostRow
              postGroup={postSplit}
              setPreviewPost={setPreviewPost}
            />
          );
        }}
      />
      {previewPost && <ProfilePostPreview post={previewPost} />}
    </>
  );
}
