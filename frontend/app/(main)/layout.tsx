import SessionProvider from "@/src/auth/components/session-provider";
import Sidebar from "@/src/common/components/sidebar";
import React, { PropsWithChildren } from "react";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <main className="grid grid-cols-3 min-h-screen">
        <Sidebar />
        <div>{children}</div>
      </main>
    </SessionProvider>
  );
};

export default MainLayout;
