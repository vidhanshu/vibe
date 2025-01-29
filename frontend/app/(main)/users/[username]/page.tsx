import { geUserByUsername } from "@/src/users/actions/user-actions";
import React from "react";

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const { message, user } = await geUserByUsername(username);
  if (message) return <p>User not found!</p>;

  return (
    <div>
      <p>username: {username}</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default UserPage;
