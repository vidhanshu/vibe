import { Button } from "@/components/ui/button";
import { getProfile } from "@/src/auth/actions/auth-actions";
import LogoutButton from "@/src/auth/components/logout-btn";
import Link from "next/link";
import React from "react";

const Home = async () => {
  const profile = await getProfile();

  return (
    <div>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      <div className="flex gap-x-4">
        <Link href="/auth">
          <Button>Sign Up</Button>
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
};

export default Home;
