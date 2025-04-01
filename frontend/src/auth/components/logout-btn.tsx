"use client";

import Button from "@/components/ui/button";
import { signOut } from "@/src/auth/actions/auth-actions";
import { ConfirmationModal } from "@/src/common/components/modals/confirmation-modal";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();

  const logoutHandler = async () => {
    await signOut();
    toast.success("Logged out successfully");
    router.replace("/auth");
  };

  return (
    <ConfirmationModal
      onConfirm={logoutHandler}
      title="Log out?"
      subtitle="You'll be logged out of the Vibe"
    >
      <Button endContent={<LogOut className="size-4"/>}>Logout</Button>
    </ConfirmationModal>
  );
};

export default LogoutButton;
