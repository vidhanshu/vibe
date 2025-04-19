import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import useSessionStore from "@/src/common/stores/session-store";
import { Box } from "@/components/ui/box";

export default function AuthProtectedLayout() {
  const { user, isLoading } = useSessionStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth");
    }
  }, [isLoading, user]);

  if (isLoading || (!user && !isLoading)) {
    return (
      <Box className="flex-1 flex items-center justify-center">
        <ActivityIndicator className="text-primary-500" size="large" />
      </Box>
    );
  }

  return <Slot />; // Only render child routes if authed
}
