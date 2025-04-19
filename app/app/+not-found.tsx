import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";

export default function NotFoundScreen() {
  return (
    <React.Fragment>
      <Stack.Screen options={{ title: "Page not found!" }} />
      <Box className="px-4 flex-1 flex items-center justify-center">
        <Card variant="outline">
          <Heading className="mb-4">
            😕 Oops! This Vibe doesn&apos;t exist
          </Heading>
          <Text>
            We couldn&apos;t find what you were looking for. Maybe the link is
            broken, the content was deleted, or it never existed in the first
            place.
          </Text>
          <View className="my-4 h-[1] bg-background-muted" />
          <Heading>🔍 Try one of these instead:</Heading>
          <Text>
            • Go back to{" "}
            <Link href="/" className="text-blue-500">
              Home
            </Link>
          </Text>
          <Text>
            • Check out trending{" "}
            <Link href="/" className="text-blue-500">
              Vibes
            </Link>
          </Text>
          <Text>
            • Visit your{" "}
            <Link href="/" className="text-blue-500">
              Profile
            </Link>
          </Text>
        </Card>
      </Box>
    </React.Fragment>
  );
}
