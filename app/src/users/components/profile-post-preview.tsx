import React, { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { NSPost } from "@/src/posts/types";
import { Dimensions, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Card } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";

const screenHeight = Dimensions.get("window").height;

const ProfilePostPreview = ({
  post: previewPost,
}: {
  post: NSPost.DetailedPost;
}) => {
  const [imageAspectRatio, setImageAspectRatio] = useState(1);

  useEffect(() => {
    const media = previewPost?.medias?.[0];
    if (media?.mediaType !== "VIDEO" && media?.url) {
      Image.getSize(media.url, (width, height) => {
        if (width && height) {
          setImageAspectRatio(width / height);
        }
      });
    }
  }, [previewPost]);

  return (
    <Box className="absolute w-screen h-screen inset-0 z-10 bg-black/80 flex justify-center px-4">
      <Card className="p-0 overflow-hidden border border-secondary-500">
        <HStack
          className="px-4 py-2 items-center border-b border-secondary-500"
          space="md"
        >
          <Avatar size="sm">
            <AvatarFallbackText>
              {previewPost.user.name || previewPost.user.username}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: previewPost.user.profilePhoto?.url }} />
          </Avatar>
          <Heading size="sm">{previewPost.user.username}</Heading>
        </HStack>
        <Box className="bg-black">
          {previewPost.medias[0].mediaType === "VIDEO" ? (
            <Box
              style={{ maxHeight: screenHeight * 0.7 }}
              className="mx-auto w-full"
            >
              <Video
                source={{ uri: previewPost.medias[0].url }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                shouldPlay
                isLooping
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          ) : (
            <Image
              resizeMode="contain"
              source={{ uri: previewPost.medias[0].url }}
              className="w-full max-h-[70vh] mx-auto"
              style={{ aspectRatio: imageAspectRatio }}
            />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default ProfilePostPreview;
