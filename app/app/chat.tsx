import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import useSwipe from "@/src/common/hooks/use-swipe";
import { router } from "expo-router";

export default function ChatScreen() {
  const panHandler = useSwipe({ onSwipeRight: () => router.back() });
  return (
    <Box {...panHandler} className="flex-1">
      <Text>Chat Screen</Text>
    </Box>
  );
}
