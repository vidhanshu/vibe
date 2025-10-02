import SessionProvider from "@/src/auth/components/session-provider";
import Sidebar, {
  NavbarMobile,
  SidebarMobile,
} from "@/src/common/components/sidebar/sidebar";
import NotificationContextProvider from "@/src/common/contexts/notification-context";
import { SocketContextProvider } from "@/src/common/contexts/socket-context";
import { checkAuth } from "@/src/users/actions/user-actions";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

const MainLayout = async ({ children }: PropsWithChildren) => {
  const { data } = await checkAuth();

  if (!data) return redirect("/auth");
  return (
    <SessionProvider>
      <SocketContextProvider>
        <main className="relative min-h-screen md:flex md:pb-0">
          {/* Sidebar */}
          <NotificationContextProvider>
            <>
              <aside className="hidden md:block sticky top-0 h-screen z-[20]">
                <Sidebar />
              </aside>
              <nav className="md:hidden sticky top-0 bg-black z-[20]">
                <NavbarMobile />
              </nav>
            </>
          </NotificationContextProvider>

          {/* Main Content */}
          <div className="flex-1">{children}</div>

          <aside className="md:hidden fixed bottom-0 inset-x-0 z-[20]">
            <SidebarMobile />
          </aside>
        </main>
      </SocketContextProvider>
    </SessionProvider>
  );
};

export default MainLayout;
