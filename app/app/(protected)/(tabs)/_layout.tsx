import React from "react";
import { router, Tabs } from "expo-router";
import { Pressable } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import { AntDesign, Entypo, Feather, Foundation } from "@expo/vector-icons";
import colors from "@/src/common/constants/colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
        name="profile"
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <AntDesign size={25} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
