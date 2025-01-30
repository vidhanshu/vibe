import React from "react";
import NoContent from "./no-content";
import { Youtube } from "lucide-react";

const ProfileReels = () => {
  return (
    <div>
      <NoContent
        icon={Youtube}
        subtitle="When you share reels, they will appear on your profile."
      />
    </div>
  );
};

export default ProfileReels;
