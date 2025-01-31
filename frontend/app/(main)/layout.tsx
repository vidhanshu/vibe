import SessionProvider from "@/src/auth/components/session-provider";
import Sidebar from "@/src/common/components/sidebar/sidebar";
import React, { PropsWithChildren } from "react";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <main className="relative min-h-screen grid grid-cols-[250px_1fr] gap-x-4">
        {/* Sidebar */}
        <aside className="sticky top-0 h-screen">
          <Sidebar />
        </aside>

        {/* Main Content */}
        {children}
      </main>
    </SessionProvider>
  );
};

export default MainLayout;
