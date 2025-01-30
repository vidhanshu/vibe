import { getUserByUsername } from "@/src/users/actions/user-actions";
import ProfileHeader from "@/src/users/components/profile-header";
import React, { PropsWithChildren } from "react";

const ProfileLayout = async ({ children }: PropsWithChildren) => {
  return (
    <div className="py-8 space-y-16">
      <ProfileHeader />
      <div className="max-w-[900px] mx-auto">{children}</div>
    </div>
  );
};

export default ProfileLayout;
