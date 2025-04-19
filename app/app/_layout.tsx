import FontAwesome from "@expo/vector-icons/FontAwesome";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SessionProvider from "@/src/common/components/session-provider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(protected)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    AlataRegular: require("../assets/fonts/Alata-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <App />;
}

const queryClient = new QueryClient();

function App() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode="dark">
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <Stack>
              <Stack.Screen
                name="auth"
                options={{ headerShown: false, animation: "none" }}
              />
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="create"
                options={{ headerShown: false, animation: "slide_from_left" }}
              />
              <Stack.Screen
                name="chat"
                options={{ headerShown: false, animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="notifications"
                options={{ animation: "slide_from_right" }}
              />
            </Stack>
          </SessionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
