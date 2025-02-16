import { getUserByUsername } from "@/src/users/actions/user-actions";
import ProfilePosts from "@/src/users/components/profile-posts";

const UserPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const { message, data } = await getUserByUsername(username);
  if (message) return <p>User not found!</p>;

  return <ProfilePosts />;
};

export default UserPage;
