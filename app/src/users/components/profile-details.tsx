import React from "react";
import { NSUser } from "../types";
import { Box } from "@/components/ui/box";
import { ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

const PRONOUN_MAP = {
  he: "he/his",
  she: "she/her",
  they: "they/them",
};

const ProfileDetails = ({
  user,
  isLoading,
}: {
  user?: NSUser.DetailedUser | null;
  isLoading: boolean;
}) => {
  return (
    <Box className="px-4">
      {isLoading ? (
        <Box className="flex-1 flex justify-center items-center">
          <ActivityIndicator color="white" size="large" />
        </Box>
      ) : user ? (
        <VStack space="xl">
          <HStack space="xl" className="mt-8">
            <Avatar size="xl">
              <AvatarFallbackText>
                {user.name || user.username}
              </AvatarFallbackText>
              <AvatarImage source={{ uri: user.profilePhoto?.url }} />
            </Avatar>
            <Box className="flex justify-between flex-1">
              <Heading size="sm">
                {user.name ?? user.username}
                {user.pronoun && (
                  <Text className="text-typography-500 !font-[400]">
                    {" "}
                    {PRONOUN_MAP[user.pronoun]}
                  </Text>
                )}
              </Heading>
              <Box className="flex flex-row justify-between items-center">
                <VStack>
                  <Heading>{user._count.posts}</Heading>
                  <Text size="md">posts</Text>
                </VStack>
                <VStack>
                  <Heading>{user._count.followers}</Heading>
                  <Text size="md">followers</Text>
                </VStack>
                <VStack>
                  <Heading>{user._count.followings}</Heading>
                  <Text size="md">followings</Text>
                </VStack>
              </Box>
            </Box>
          </HStack>
          <HStack space="sm">
            <Button
              className="flex-1 rounded-lg"
              variant="outline"
              action="default"
            >
              <ButtonText>Edit Profile</ButtonText>
            </Button>
            <Button className="rounded-lg" variant="outline" action="default">
              <ButtonText>Share Profile</ButtonText>
            </Button>
            <Button
              className="flex-1 rounded-lg"
              variant="outline"
              action="default"
            >
              <ButtonText>Contact</ButtonText>
            </Button>
          </HStack>
          {user.bio && <Text>{user.bio}</Text>}
        </VStack>
      ) : (
        <>
          <Text>Not found!</Text>
        </>
      )}
    </Box>
  );
};

export default ProfileDetails;
