import { Pressable } from "react-native";
import { Button } from "@/components/ui/button";
import React from "react";
import { Box } from "@/components/ui/box";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Heading } from "@/components/ui/heading";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Icon, StarIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";

const FeedHeader = () => {
  return (
    <Box className="px-4 py-2 border-b border-secondary-500 flex justify-between flex-row">
      <Menu
        offset={-30}
        placement="bottom left"
        disabledKeys={["Settings"]}
        trigger={({ ...triggerProps }) => {
          return (
            <Pressable {...triggerProps} android_ripple={false}>
              <Box className="flex flex-row gap-x-2 items-center">
                <Heading size="2xl">Vibe</Heading>
                <AntDesign color="white" name="down" />
              </Box>
            </Pressable>
          );
        }}
      >
        <MenuItem key="followings" textValue="Followings">
          <Feather color="white" name="users" size={16} className="mr-2" />
          <MenuItemLabel size="lg">Followings</MenuItemLabel>
        </MenuItem>
        <MenuItem key="favorites" textValue="Favorites">
          <Icon as={StarIcon} size="lg" className="mr-2" />
          <MenuItemLabel size="lg">Favorites</MenuItemLabel>
        </MenuItem>
      </Menu>

      <HStack space="xl">
        <Button
          onPress={() => router.push("/notifications")}
          variant="link"
          style={{ position: "relative" }}
        >
          <Feather size={25} color="white" name="heart" />
          <Box className="w-3 h-3 bg-primary-500 absolute top-1 -right-1 rounded-full border-2 border-black" />
        </Button>
        <Button
          variant="link"
          className="relative"
          onPress={() => router.push("/chat")}
        >
          <Feather size={25} color="white" name="message-circle" />
          <Box className="w-5 h-5 bg-primary-500 absolute top-1 -right-1 rounded-full border-2 border-black flex items-center justify-center">
            <Text className="text-xs">4</Text>
          </Box>
        </Button>
      </HStack>
    </Box>
  );
};

export default FeedHeader;
