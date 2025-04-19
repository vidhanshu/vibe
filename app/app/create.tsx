import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import useSwipe from "@/src/common/hooks/use-swipe";
import { router } from "expo-router";

export default function CreateScreen() {
  const panHandler = useSwipe({ onSwipeLeft: () => router.back() });
  return (
    <Box {...panHandler} className="flex-1">
      <Text>Create Screen</Text>
    </Box>
  );
}
