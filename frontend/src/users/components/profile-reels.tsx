"use client";

import React from "react";
import NoContent from "./no-content";
import { Youtube } from "lucide-react";
import useSessionStore from "@/src/common/stores/session-store";
import { useParams } from "next/navigation";

const ProfileReels = () => {
  const { user } = useSessionStore();
  const params = useParams();
  const isSelf = user?.username === params.username;

  return (
    <div>
      <NoContent
        icon={Youtube}
        {...(!isSelf
          ? {
              title: "No reels",
              subtitle: "",
              titleClassName:"text-muted-foreground"
            }
          : {
              subtitle:
                "When you share reels, they will appear on your profile.",
            })}
      />
    </div>
  );
};

export default ProfileReels;
