import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div>
      <Link href="/auth">
        <Button>Sign Up</Button>
      </Link>
    </div>
  );
};

export default Home;
