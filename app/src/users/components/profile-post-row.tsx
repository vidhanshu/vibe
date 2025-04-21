import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { NSPost } from "@/src/posts/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable } from "react-native";

const ProfilePostRow = ({
  postGroup,
  setPreviewPost,
}: {
  postGroup: NSPost.DetailedPost[];
  setPreviewPost?: React.Dispatch<
    React.SetStateAction<NSPost.DetailedPost | null>
  >;
}) => {
  return (
    <HStack space="xs">
      {postGroup.map(({ medias, id, user, ...restPost }) => (
        <Pressable
          key={id}
          className="w-1/3 relative"
          onLongPress={() => {
            setPreviewPost?.({ medias, id, user, ...restPost });
          }}
          onPressOut={() => {
            setPreviewPost?.(null);
          }}
          onPress={() => {
            router.push(`/users/${user?.username}/posts`);
          }}
        >
          {medias[0].mediaType === "VIDEO" ? (
            <Box>
              <Image
                className="w-full h-48 opacity-30"
                resizeMode="contain"
                source={require("/assets/images/icon.png")}
              />
              <Feather
                name="play"
                size={35}
                color="white"
                className="absolute top-[40%] right-[40%]"
              />
            </Box>
          ) : (
            <Box>
              <Image className="w-full h-48" source={{ uri: medias[0].url }} />
              {medias.length > 1 && (
                <Ionicons
                  size={25}
                  color="white"
                  name="images-outline"
                  className="absolute top-2 right-2"
                />
              )}
            </Box>
          )}
        </Pressable>
      ))}
    </HStack>
  );
};

export default ProfilePostRow;
