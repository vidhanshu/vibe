import { getUserByUsername } from "@/src/users/actions/user-actions";
import ProfilePosts from "@/src/users/components/profile-posts";
import React from "react";

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const { message, user } = await getUserByUsername(username);
  if (message) return <p>User not found!</p>;

  return (
    <div>
      <ProfilePosts />
    </div>
  );
};

export default UserPage;
