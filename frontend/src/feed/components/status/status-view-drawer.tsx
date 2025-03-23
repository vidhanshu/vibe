"use client";

import Button from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import UserAvatar from "@/src/auth/components/user-avatar";
import useIsMobile from "@/src/common/hooks/use-is-mobile";
import { getShortRelativeTime } from "@/src/common/utils/dayjs";
import { NSPost } from "@/src/posts/types";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { addStatusView } from "../../actions/status-action";
import StatusViewer from "./status-viewer";

const StatusViewDrawer = ({
  close,
  statuses,
  viewStatusIdx,
  setViewStatusIdx,
}: {
  statuses: NSPost.Status[];
  viewStatusIdx: null | number;
  setViewStatusIdx: React.Dispatch<React.SetStateAction<null | number>>;
  close: () => void;
}) => {
  const { mutate } = useMutation({
    mutationFn: async () => {
      // if already viewed skip
      if (viewStatusIdx === null || statuses[viewStatusIdx].viewed) return;
      const res = await addStatusView(statuses[viewStatusIdx].id);
      if (res.message) toast.error(res.message);
    },
  });
  const status = viewStatusIdx !== null ? statuses[viewStatusIdx] : null;
  const prevStatus =
    viewStatusIdx !== null && viewStatusIdx > 0
      ? statuses[viewStatusIdx - 1]
      : null;
  const nextStatus =
    viewStatusIdx !== null && viewStatusIdx < statuses.length - 1
      ? statuses[viewStatusIdx + 1]
      : null;
  const isDesktop = !useIsMobile();

  useEffect(() => {
    if (viewStatusIdx !== null) mutate();
  }, [viewStatusIdx, mutate]);

  return (
    <Drawer open={viewStatusIdx !== null} onClose={close}>
      <DrawerContent
        className="h-[99%] md:h-full bg-black md:bg-neutral-800 mt-0 flex flex-col"
        handleClassName="hidden"
      >
        <DrawerHeader className="relative hidden">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>

        <Button
          className="hidden md:flex absolute right-4 top-4 bg-white/20"
          onClick={close}
          size="icon-sm"
          endContent={<X className="size-4" />}
        />
        <div className="h-2 w-32 bg-white/40 mx-auto rounded-full md:hidden mt-2"></div>
        <div className="grid md:grid-cols-3 items-center flex-1">
          {isDesktop && (
            <div className="flex items-center justify-center">
              <AnimatePresence>
                {prevStatus && (
                  <StatusCardPreview
                    setViewStatusIdx={setViewStatusIdx}
                    status={prevStatus}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
          {status && (
            <div className="max-w-md w-full mx-auto space-y-4">
              <StatusViewer
                viewStatusIdx={viewStatusIdx}
                totalStatuses={statuses.length}
                setViewStatusIdx={setViewStatusIdx}
                status={status}
              />
            </div>
          )}
          {isDesktop && (
            <div className="flex items-center justify-center">
              <AnimatePresence>
                {nextStatus && (
                  <StatusCardPreview
                    setViewStatusIdx={setViewStatusIdx}
                    status={nextStatus}
                    left={false}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StatusViewDrawer;

const StatusCardPreview = ({
  status,
  setViewStatusIdx,
  left = true,
}: {
  status: NSPost.Status;
  setViewStatusIdx: React.Dispatch<React.SetStateAction<number | null>>;
  left?: boolean;
}) => {
  const image = status?.medias?.find((media) => media.mediaType === "IMAGE");

  return (
    <motion.div
      initial={{
        x: 0,
        scale: 0,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        height: "calc(100vh - 20px)",
        width: "448px",
        x: left ? "100%" : "-100%",
        opacity: 0,
      }}
      onClick={() =>
        setViewStatusIdx((v) => {
          if (v === null) return v;
          return left ? v - 1 : v + 1;
        })
      }
      className="h-[300px] w-[200px] bg-cover bg-center rounded-lg overflow-hidden cursor-pointer"
      style={{
        backgroundImage: `url('${image?.url}')`,
      }}
    >
      <div className="w-full h-full bg-black/30 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <UserAvatar
            className="size-16"
            fallbackClassName="text-4xl"
            username={status.user.username}
            url={status.user.profilePhoto?.url}
          />
          <span className="text-lg font-bold">{status.user.username}</span>
          <span className="font-normal text-white">
            {getShortRelativeTime(status.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
