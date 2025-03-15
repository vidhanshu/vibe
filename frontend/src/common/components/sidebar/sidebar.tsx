"use client";

import Button, { ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import { getUsers } from "@/src/users/actions/user-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
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
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDebounceValue, useOnClickOutside } from "usehooks-ts";
import useSessionStore from "../../stores/session-store";
import CreatePostModal from "../modals/create-post-modal";
import SearchDrawer, { SearchDrawerContent } from "./search-drawer";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const handleClickOutside = () => {
    if (collapsed) setCollapsed(false);
  };

  useOnClickOutside(ref, handleClickOutside);

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
                  startContent: (
                    <UserAvatar
                      url={user?.profilePhoto?.url}
                      username={user?.username}
                    />
                  ),
                  onClick: () => setCollapsed(false),
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

export const SidebarMobile = () => {
  const { user } = useSessionStore();

  return (
    <div className="border-t px-4 py-2 bg-black flex items-center justify-between">
      <Link href="/">
        <Button
          size="icon"
          variant="ghost"
          endContent={<Home className="size-6" />}
        />
      </Link>
      <Button
        size="icon"
        variant="ghost"
        endContent={<Compass className="size-6" />}
      />
      <CreatePostModal asChild>
        <Button
          size="icon"
          variant="ghost"
          className="w-10"
          endContent={<PlusSquare className="size-6" />}
        />
      </CreatePostModal>
      <Button
        size="icon"
        variant="ghost"
        endContent={<MessageCircle className="size-6" />}
      />
      <Link href={`/users/${user?.username}`}>
        <Button
          size="icon"
          variant="ghost"
          endContent={
            <UserAvatar
              url={user?.profilePhoto?.url}
              username={user?.username}
            />
          }
        />
      </Link>
    </div>
  );
};

export const NavbarMobile = () => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const popoverRef = useRef<any>(null);
  const [debounced, updateDebounced] = useDebounceValue("", 1000);

  const qc = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["search"],
    queryFn: async () => {
      setIsLoading(true);
      const { data, message } = await getUsers({
        search: debounced,
      });
      setIsLoading(false);
      if (message) toast.error(message);
      return data;
    },
  });

  useEffect(() => {
    if (!debounced.trim().length) {
      qc?.setQueryData(["search"], null); // Set data to null
      return;
    }
    setIsLoading(true);
    refetch().finally(() => {
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, qc]);

  useOnClickOutside(popoverRef, () => {
    setOpen(false);
  });

  return (
    <div>
      <div className="flex gap-x-2 items-center py-2 px-2 border-b">
        <Link href="/">
          <Image
            src="/logo.svg"
            className=""
            alt="logo"
            width={40}
            height={40}
          />
        </Link>
        <div ref={popoverRef} className="flex-1 relative">
          <Input
            ref={inputRef}
            onFocus={() => {
              setOpen(true);
            }}
            onChange={(e) => updateDebounced(e.target.value)}
            type="search"
            placeholder="Search"
            className="bg-secondary"
          />
          {open && (
            <div className="absolute left-0 right-0 mx-auto top-[calc(100%+4px)] bg-secondary rounded-md">
              <SearchDrawerContent
                data={data}
                debounced={debounced}
                isLoading={isLoading}
                closeCollapse={() => setOpen(false)}
              />
            </div>
          )}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="min-w-10"
          endContent={<Heart className="size-6" />}
        />
      </div>
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
