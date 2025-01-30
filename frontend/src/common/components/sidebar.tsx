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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserAvatar from "@/src/auth/components/user-avatar";
import useSessionStore from "../stores/session-store";

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
  {
    icon: PlusSquare,
    href: null,
  },
];

const Sidebar = () => {
  const { user } = useSessionStore();

  return (
    <div className="pr-6 pl-4 py-8 space-y-8 col-span-2 h-full">
      <Image
        src="/full-logo.svg"
        className=""
        alt="logo"
        width={100}
        height={42}
      />
      <div className="space-y-4">
        {/* {SIDEBAR_ITEMS.map(({}) => {
          return <></>;
        })} */}
        <Link href="/">
          <SidebarItem icon={Home}>Home</SidebarItem>
        </Link>
        <SidebarItem icon={Search}>Search</SidebarItem>
        <SidebarItem icon={Compass}>Explore</SidebarItem>
        <SidebarItem icon={MessageCircle}>Messages</SidebarItem>
        <SidebarItem icon={Heart}>Notifications</SidebarItem>
        <SidebarItem icon={PlusSquare}>Create</SidebarItem>
        <div>
          <Link aria-disabled={!user} href={`/users/${user?.username}`}>
            <SidebarItem
              icon={PlusSquare}
              buttonProps={{
                startContent: <UserAvatar />,
              }}
            >
              Profile
            </SidebarItem>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

const SidebarItem = ({
  icon: Icon,
  children,
  buttonProps = {},
}: { icon: LucideIcon; buttonProps?: ButtonProps } & PropsWithChildren) => {
  return (
    <Button
      variant="ghost"
      startContent={<Icon className="size-6" />}
      className="justify-start font-medium text-base w-full h-12"
      {...buttonProps}
    >
      {children}
    </Button>
  );
};
