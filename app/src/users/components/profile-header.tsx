import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import useSessionStore from "@/src/common/stores/session-store";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Text } from "@/components/ui/text";
import ConfirmationDialog from "@/src/common/components/confirmation-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { authService } from "@/src/auth/auth.service";
import useAppToast from "@/src/common/hooks/use-app-toast";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import DividerWithTitle from "@/src/common/components/divider-with-title";

const ProfileHeader = ({ username }: { username: string }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toast = useAppToast({});
  const qc = useQueryClient();
  const logoutHandler = async () => {
    await authService.signOut();
    toast.success("Logged out");
    qc.invalidateQueries({ queryKey: ["session"] });
    router.replace("/auth");
  };

  return (
    <Box className="px-4 pt-4 flex flex-row justify-between">
      <Heading isTruncated size="2xl">
        {username}
      </Heading>

      <Pressable onPress={() => setShowDrawer((p) => !p)}>
        <Feather name="menu" size={25} color="white" />
      </Pressable>

      <Drawer
        size="lg"
        anchor="right"
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
      >
        <DrawerBackdrop />
        <DrawerContent className="p-4">
          <DrawerHeader>
            <Heading size="xl">Settings</Heading>
            <Button onPress={() => setShowDrawer(false)} variant="link">
              <AntDesign name="close" color="white" size={25} />
            </Button>
          </DrawerHeader>
          <DrawerBody>
            <VStack space="md">
              <DividerWithTitle title="Profile" />
              <HStack
                space="md"
                className="active:bg-secondary-500 p-2 rounded-md items-center"
              >
                <AntDesign name="edit" color="white" size={16} />
                <Text>Edit profile</Text>
              </HStack>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <VStack className="w-full" space="md">
              <DividerWithTitle title="Danger zone" />
              <ConfirmationDialog
                open={showConfirm}
                title="Log out?"
                description="You'll be logged out of the vibe"
                setOpen={setShowConfirm}
                onConfirm={() => {
                  logoutHandler();
                  setShowConfirm(false);
                }}
              >
                <Button
                  variant="link"
                  className="w-fit justify-start"
                  onPress={() => setShowConfirm(true)}
                >
                  <ButtonText>Log out</ButtonText>
                  <Feather color="#e11d4e" size={14} name="log-out" />
                </Button>
              </ConfirmationDialog>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default ProfileHeader;
