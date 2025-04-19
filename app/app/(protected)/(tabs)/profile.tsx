import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { authService } from "@/src/auth/auth.service";
import ConfirmationDialog from "@/src/common/components/confirmation-dialog";
import useAppToast from "@/src/common/hooks/use-app-toast";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

export default function ProfileScreen() {
  const toast = useAppToast({});
  const qc = useQueryClient();
  const [openConfirm, setOpenConfirm] = useState(false);

  const logoutHandler = async () => {
    await authService.signOut();
    toast.success("Logged out");
    qc.invalidateQueries({ queryKey: ["session"] });
    router.replace("/auth");
  };

  return (
    <Box className="px-4">
      <Text>Profile</Text>
      <ConfirmationDialog
        open={openConfirm}
        title="Log out?"
        description="You'll be logged out of the vibe"
        setOpen={setOpenConfirm}
        onConfirm={() => {
          logoutHandler();
          setOpenConfirm(false);
        }}
      >
        <Button onPress={() => setOpenConfirm(true)}>
          <ButtonText>Log out</ButtonText>
          <Feather color="white" size={14} name="log-out" />
        </Button>
      </ConfirmationDialog>
    </Box>
  );
}
