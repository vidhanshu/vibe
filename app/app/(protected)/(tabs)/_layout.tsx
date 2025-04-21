import React from "react";
import { router, Tabs, useLocalSearchParams, usePathname } from "expo-router";
import { Pressable } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import { Entypo, Feather, Foundation } from "@expo/vector-icons";
import colors from "@/src/common/constants/colors";
import useSessionStore from "@/src/common/stores/session-store";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useSessionStore();
  const pathname = usePathname();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors[colorScheme ?? "light"].tint,
        tabBarShowLabel: false,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Foundation size={25} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <Feather size={25} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-placeholder"
        options={{
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={() => router.push("/create")}
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 8,
              }}
            >
              <Feather name="plus-square" size={24} color="gray" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo size={25} name="video-camera" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users/[username]"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Avatar
              size="sm"
              className={
                focused && pathname === `/users/${user?.username}`
                  ? "border-2 border-white"
                  : ""
              }
            >
              <AvatarFallbackText>
                {user?.name || user?.username}
              </AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: user?.profilePhoto?.url,
                }}
              />
            </Avatar>
          ),
        }}
      />
    </Tabs>
  );
}
