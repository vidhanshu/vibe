import LogoutButton from "@/src/auth/components/logout-btn";
import React from "react";

const Home = () => {
  return (
    <div>
      <h1>
        Gonna be root page, where we have 3 sections, vertically splitted,
      </h1>
      <ul>
        <li>Sidebar</li>
        <li>Feed</li>
        <li>Suggested for you </li>
      </ul>
      <LogoutButton />
    </div>
  );
};

export default Home;
