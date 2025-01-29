"use client";

import Button from "@/components/ui/button";
import { signOut } from "@/src/auth/actions/auth-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await signOut();
        toast.success("Logged out successfully");
        router.replace("/auth");
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
