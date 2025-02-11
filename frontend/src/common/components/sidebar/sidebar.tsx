"use client";

import Button, { ButtonProps } from "@/components/ui/button";
import {
  Compass,
  Heart,
  Home,
  LucideIcon,
  MessageCircle,
  PlusSquare,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import UserAvatar from "@/src/auth/components/user-avatar";
import useSessionStore from "../../stores/session-store";
import CreatePostModal from "../modals/create-post-modal";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounceValue, useOnClickOutside } from "usehooks-ts";
import { getUsers } from "@/src/users/actions/user-actions";
import { toast } from "sonner";
import SearchDrawer from "./search-drawer";

const SIDEBAR_ITEMS = [
  {
    icon: Home,
    href: "/",
  },
  {
    icon: Search,
    href: null,
  },
  {
    icon: Compass,
    href: null,
  },
  {
    icon: MessageCircle,
    href: null,
  },
  {
    icon: Heart,
    href: null,
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<"search" | "notification">("search");
  const { user } = useSessionStore();

  const drawerContent = () => {
    switch (mode) {
      case "search":
        return (
          <SearchDrawer
            closeCollapse={() => {
              setCollapsed(false);
            }}
          />
        );
      case "notification":
        return <NotificationDrawer />;
      default:
        return null;
    }
  };

  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = () => {
    if (collapsed) setCollapsed(false);
  };

  useOnClickOutside(ref as any, handleClickOutside);

  return (
    <div ref={ref} className="h-full">
      <div
        className={cn(
          "pr-6 pl-4 py-8 space-y-8 h-full",
          collapsed
            ? "w-[82px] p-0 pt-8 flex flex-col items-center"
            : "border-r w-full"
        )}
      >
        {!collapsed ? (
          <Image
            src="/full-logo.svg"
            className=""
            alt="logo"
            width={100}
            height={42}
          />
        ) : (
          <Image
            src="/logo.svg"
            className=""
            alt="logo"
            width={40}
            height={40}
          />
        )}
        <div
          className={cn("space-y-4", collapsed && "flex flex-col items-center")}
        >
          <Link href="/">
            <SidebarItem
              buttonProps={{ onClick: () => setCollapsed(false) }}
              collapsed={collapsed}
              icon={Home}
            >
              Home
            </SidebarItem>
          </Link>
          <SidebarItem
            buttonProps={{
              onClick: () => {
                setMode("search");
                if (collapsed && mode === "notification") return;
                setCollapsed((p) => !p);
              },
            }}
            collapsed={collapsed}
            icon={Search}
          >
            Search
          </SidebarItem>
          <SidebarItem collapsed={collapsed} icon={Compass}>
            Explore
          </SidebarItem>
          <SidebarItem collapsed={collapsed} icon={MessageCircle}>
            Messages
          </SidebarItem>
          <SidebarItem
            collapsed={collapsed}
            icon={Heart}
            buttonProps={{
              onClick: () => {
                setMode("notification");
                if (mode === "search" && collapsed) return;
                setCollapsed((p) => !p);
              },
            }}
          >
            Notifications
          </SidebarItem>
          <CreatePostModal>
            <SidebarItem collapsed={collapsed} icon={PlusSquare}>
              Create
            </SidebarItem>
          </CreatePostModal>
          <div>
            <Link aria-disabled={!user} href={`/users/${user?.username}`}>
              <SidebarItem
                collapsed={collapsed}
                icon={PlusSquare}
                buttonProps={{
                  startContent: <UserAvatar url={user?.profilePhoto?.url} username={user?.username} />,
                }}
              >
                Profile
              </SidebarItem>
            </Link>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {collapsed && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "400px" }}
            exit={{ width: 0 }}
            className="fixed inset-y-0 m-auto left-[68px] border-y border-r w-[400px] rounded-r-2xl bg-background z-[1000] overflow-hidden"
          >
            <div className="w-[400px] py-8">{drawerContent()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;

const SidebarItem = ({
  icon: Icon,
  children,
  buttonProps = {},
  collapsed = false,
}: {
  icon: LucideIcon;
  buttonProps?: ButtonProps;
  collapsed?: boolean;
} & PropsWithChildren) => {
  return (
    <Button
      asChild
      variant="ghost"
      startContent={<Icon className="size-6" />}
      className={cn(
        "justify-start font-medium text-base w-full h-12",
        collapsed && "size-12"
      )}
      {...buttonProps}
    >
      {collapsed ? null : children}
    </Button>
  );
};

const NotificationDrawer = () => {
  return (
    <>
      <div className="px-6">
        <h1 className="font-bold text-2xl">Notifications</h1>
      </div>
      <Separator className="my-6" />
    </>
  );
};
