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
  Loader2,
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
import CreatePostModal from "../modals/create-post-modal/create-post-modal";
import SearchDrawer, { SearchDrawerContent } from "./search-drawer";
import { usePathname } from "next/navigation";
import { useSocketContext } from "../../contexts/socket-context";
import NotificationDrawer from "./notification-drawer";
import { useUploadStore } from "../../stores/upload-store";
import ActionTooltip from "../action-tooltip";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useSessionStore();
  const { uploads } = useUploadStore();
  const isChatPage = pathname.startsWith("/chats");

  const [collapsed, setCollapsed] = useState(isChatPage ? true : false);
  const [mode, setMode] = useState<"search" | "notification" | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const handleClickOutside = () => {
    if (isChatPage) return setMode(null);
    if (collapsed) setCollapsed(false);
  };

  useOnClickOutside(ref, handleClickOutside);
  const { isConnected } = useSocketContext();

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
        return (
          <NotificationDrawer
            closeDrawer={() => {
              setMode(null);
              setCollapsed(false);
            }}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isChatPage) {
      setCollapsed(true);
    } else setCollapsed(false);
  }, [isChatPage]);
  console.log("uploads", uploads);
  return (
    <div
      ref={ref}
      className={cn("h-full", isChatPage ? "w-fit border-r" : "w-[250px]")}
    >
      <div
        className={cn(
          "pr-6 pl-4 py-8 space-y-8 h-full relative",
          collapsed
            ? "w-[82px] p-0 pt-8 flex flex-col items-center overflow-visible"
            : "border-r w-full"
        )}
      >
        <div
          className={cn(
            "size-2 absolute rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )}
        />
        <div>
          <Link href="/" className="cursor-pointer w-fit rounded-sm">
            <div
              className={cn(
                "w-fit",
                collapsed &&
                  "hover:bg-accent rounded-sm size-12 flex items-center justify-center"
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
                  width={34}
                  height={34}
                />
              )}
            </div>
          </Link>
        </div>
        <div
          className={cn("space-y-4", collapsed && "flex flex-col items-center")}
        >
          <Link href="/">
            <SidebarItem
              buttonProps={{
                onClick: () => {
                  setCollapsed(false);
                  setMode(null);
                },
              }}
              collapsed={collapsed}
              icon={Home}
            >
              Home
            </SidebarItem>
          </Link>
          <SidebarItem
            buttonProps={{
              onClick: () => {
                setMode((p) => (p === "search" ? null : "search"));
                if (collapsed && mode === "notification") return;
                if (isChatPage) setCollapsed(true);
                else setCollapsed((p) => !p);
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
          <div>
            <Link href="/chats">
              <SidebarItem collapsed={collapsed} icon={MessageCircle}>
                Messages
              </SidebarItem>
            </Link>
          </div>
          <SidebarItem
            collapsed={collapsed}
            icon={Heart}
            buttonProps={{
              onClick: () => {
                setMode((p) =>
                  p === "notification" && collapsed ? null : "notification"
                );
                if (mode === "search" && collapsed) return;
                if (isChatPage) setCollapsed(true);
                else setCollapsed((p) => !p);
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
        {collapsed && mode && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "400px" }}
            exit={{ width: "20px" }}
            className="fixed inset-y-0 m-auto left-[68px] border-y border-r w-[400px] rounded-r-2xl bg-background z-[1000] overflow-hidden"
          >
            <div className="w-[400px] py-8">{drawerContent()}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* status/post upload statuses */}
      {uploads.length > 0 && (
        <div className="absolute bottom-4 left-4 space-y-2">
          {uploads.map(({ id, status }) => {
            const isStatus = id.startsWith("status-");
            return (
              <div
                key={id}
                className={cn(
                  "flex items-center gap-2 text-sm px-2 py-1 rounded-sm",
                  {
                    "bg-yellow-950": status === "uploading",
                    "bg-green-950": status === "completed",
                    "bg-rose-950": status === "failed",
                  }
                )}
              >
                {!collapsed && (
                  <span>
                    {status === "uploading"
                      ? `${isStatus ? "Status" : "Post"} uploading...`
                      : status === "failed"
                      ? `Failed adding ${isStatus ? "status" : "post"} ❌`
                      : `Added ${isStatus ? "status" : "post"} ✅`}
                  </span>
                )}
                {status === "uploading" && (
                  <ActionTooltip
                    className="z-[1001]"
                    align="center"
                    side="right"
                    alignOffset={20}
                    sideOffset={20}
                    content={`${isStatus ? "Status" : "Post"} uploading...`}
                  >
                    <div className="size-5">
                      <Loader2 className="size-4 animate-spin" />
                    </div>
                  </ActionTooltip>
                )}
                {status === "failed" && collapsed && (
                  <ActionTooltip
                    className="z-[1001]"
                    align="center"
                    side="right"
                    alignOffset={20}
                    sideOffset={20}
                    content={`Failed adding ${isStatus ? "status" : "post"} ❌`}
                  >
                    <span className="text-6">❌</span>
                  </ActionTooltip>
                )}
                {status === "uploading" && collapsed && (
                  <ActionTooltip
                    content={`Added ${isStatus ? "status" : "post"} ✅`}
                    className="z-[1001]"
                    align="center"
                    side="right"
                    alignOffset={20}
                    sideOffset={20}
                  >
                    <span className="text-6 border">✅</span>
                  </ActionTooltip>
                )}
              </div>
            );
          })}
        </div>
      )}
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
    <div className="flex gap-x-2 items-center py-2 px-2 border-b">
      <Link href="/">
        <Image src="/logo.svg" className="" alt="logo" width={40} height={40} />
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
