import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { authService } from "@/src/auth/auth.service";
import ConfirmationDialog from "@/src/common/components/confirmation-dialog";
import useAppToast from "@/src/common/hooks/use-app-toast";
import useSessionStore from "@/src/common/stores/session-store";
import ProfileDetails from "@/src/users/components/profile-details";
import ProfileHeader from "@/src/users/components/profile-header";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

export default function ProfileScreen() {
  const { isLoading, user } = useSessionStore();

  return (
    <Box className="px-4 flex-1">
      <ProfileHeader />
      <ProfileDetails isLoading={isLoading} user={user} />
    </Box>
  );
}
