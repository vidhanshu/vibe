import SessionProvider from "@/src/auth/components/session-provider";
import Sidebar, {
  NavbarMobile,
  SidebarMobile,
} from "@/src/common/components/sidebar/sidebar";
import { PropsWithChildren } from "react";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <main className="relative min-h-screen md:grid md:grid-cols-[250px_1fr] md:gap-x-4 pb-[40px] md:pb-0">
        {/* Sidebar */}
        <aside className="hidden md:block sticky top-0 h-screen z-[20]">
          <Sidebar />
        </aside>
        <nav className="md:hidden sticky top-0 bg-black z-[20]">
          <NavbarMobile />
        </nav>

        {/* Main Content */}
        {children}

        <aside className="md:hidden fixed bottom-0 inset-x-0 z-[20]">
          <SidebarMobile />
        </aside>
      </main>
    </SessionProvider>
  );
};

export default MainLayout;
