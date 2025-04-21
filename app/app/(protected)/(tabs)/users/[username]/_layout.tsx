import useSessionStore from "@/src/common/stores/session-store";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function UserLayout() {
  const { username } = useLocalSearchParams();
  const { user } = useSessionStore();

  useEffect(() => {
    // If username is missing (like when user taps tab), redirect to logged-in user's profile
    if (!username && user?.username) {
      router.replace(`/users/${user.username}`);
    }
  }, [username, user]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="posts"
        options={{
          headerStyle: { backgroundColor: "black" },
          animation: "simple_push",
          headerTitle: "Posts",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
