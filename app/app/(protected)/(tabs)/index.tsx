import { ScrollView } from "react-native";

import { Text, View } from "@/components/Themed";
import React from "react";
import { Box } from "@/components/ui/box";
import { useRouter } from "expo-router";
import useSwipe from "@/src/common/hooks/use-swipe";
import FeedHeader from "@/src/home/components/feed-header";

export default function FeedScreen() {
  const router = useRouter();

  const panHandlers = useSwipe({
    onSwipeRight: () => router.push("/create"),
    onSwipeLeft: () => router.push("/chat"),
  });

  return (
    <View {...panHandlers}>
      <ScrollView>
        <FeedHeader />
        <Box className="mt-4">
          <View className="h-screen border border-red-500">
            <Text>Lorem 1</Text>
          </View>
        </Box>
      </ScrollView>
    </View>
  );
}
