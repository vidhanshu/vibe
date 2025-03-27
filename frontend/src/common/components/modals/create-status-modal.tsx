"use client";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createStatus } from "@/src/feed/actions/status-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, X } from "lucide-react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { toast } from "sonner";
import useIsMobile from "../../hooks/use-is-mobile";
import useSessionStore from "../../stores/session-store";
import ConfirmDialog from "../dialogs/confirm-dialog";
import UserChip from "../user-chip";
import SelectMediaStep from "./create-post-modal/select-media-step";
import ViewCropStep from "./create-post-modal/view-crop-step";
import uploadFileClient from "@/src/utils/upload-file-client";
import { useUploadStore } from "../../stores/upload-store";

interface Value {
  message: string;
  backgroundColor: string;
}
const CreateStatusModal = ({
  children,
  asChild = false,
}: PropsWithChildren & { asChild?: boolean }) => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"media_select" | "view_crop" | "caption">(
    "media_select"
  );
  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState({
    backgroundColor: "#000000",
    message: "",
  });

  const { addUpload, updateUpload } = useUploadStore();

  const { isPending, mutate } = useMutation({
    mutationKey: ["create-status"],
    mutationFn: async () => {
      onReset();
      // Add upload tracking for UI feedback
      const uploadId = `status-${crypto.randomUUID()}`;
      addUpload(uploadId);

      try {
        // Upload files
        const uploadedFiles = await uploadFileClient(files, (e) =>
          console.log(e)
        );
        if (!uploadedFiles) {
          updateUpload(uploadId, "failed");
          return;
        }

        // Create status
        const { message, data } = await createStatus({
          message: value.message,
          backgroundColor: value.backgroundColor,
          uploadedFiles,
        });

        if (message) {
          updateUpload(uploadId, "failed");
          return toast.error(message);
        }

        // Mark upload as completed
        updateUpload(uploadId, "completed");
        toast.success("Status added successfully");
        qc.invalidateQueries({ queryKey: ["statuses"] });
        qc.invalidateQueries({ queryKey: ["session"] });
        onReset();
        return data;
      } catch (error) {
        updateUpload(uploadId, "failed");
        return toast.error("Failed to upload status.");
      }
    },
  });

  const Steps = () => {
    switch (step) {
      case "media_select":
        return <SelectMediaStep onDrop={onDrop} />;
      case "view_crop":
        return <ViewCropStep files={files} setFiles={setFiles} />;
      case "caption":
        return (
          <CaptionStep
            files={files}
            value={value}
            isLoading={isPending}
            setValue={setValue}
          />
        );
      default:
        return null;
    }
  };

  const onDrop = (files: File[]) => {
    if (files.length) {
      setStep((s) => (s !== "view_crop" ? "view_crop" : s));
      setFiles(files);
      return;
    } else {
      setStep((s) => (s !== "media_select" ? "media_select" : s));
    }
  };

  const onReset = () => {
    setOpen(false);
    setFiles([]);
    setStep("media_select");
    setValue({
      message: "",
      backgroundColor: "#000000",
    });
  };

  useEffect(() => {
    if (files.length === 0)
      setStep((s) => (s !== "media_select" ? "media_select" : s));
  }, [files]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent
        hideCloseBtn
        aria-describedby="modal-description"
        onEscapeKeyDown={(e) => {
          step !== "media_select" && e.preventDefault();
        }}
        onInteractOutside={(e) => e.preventDefault()}
        className="p-0 border-none gap-0 rounded-md overflow-hidden w-full md:max-w-max"
        overlayProps={{
          children:
            step === "media_select" ? (
              <Button
                size="icon-sm"
                onClick={() => {
                  console.log("this-got-called");
                  setOpen(false);
                }}
                className="absolute top-4 md:top-8 right-8"
              >
                <X className="size-6" />
              </Button>
            ) : (
              <ConfirmDialog
                title="Discard status?"
                subtitle="If you leave, all your edits will be lost."
                onConfirm={() => {
                  console.log("this got called");
                  onReset();
                }}
              >
                <Button size="icon-sm" className="absolute top-8 right-8">
                  <X className="size-6" />
                </Button>
              </ConfirmDialog>
            ),
        }}
      >
        <DialogHeader className="p-4 border-b border-neutral-700">
          {step === "media_select" && (
            <DialogTitle className="text-center">Add to status</DialogTitle>
          )}
          {step === "view_crop" && (
            <div className="flex justify-between items-center">
              <ConfirmDialog
                title="Discard status?"
                subtitle="If you leave, all your edits will be lost."
                onConfirm={() => {
                  setStep((s) => (s !== "media_select" ? "media_select" : s));
                  setFiles([]);
                }}
              >
                <ArrowLeft className="size-6 cursor-pointer" />
              </ConfirmDialog>
              <DialogTitle className="text-center">View and Crop</DialogTitle>
              <button
                onClick={() => setStep("caption")}
                className="text-blue-500 font-bold hover:text-white"
              >
                Next
              </button>
            </div>
          )}
          {step === "caption" && (
            <div className="flex items-center justify-between">
              <button disabled={isPending}>
                <ArrowLeft
                  onClick={() => setStep("view_crop")}
                  className="size-6 cursor-pointer"
                />
              </button>
              <DialogTitle className="text-center">Add to status</DialogTitle>
              <button
                disabled={isPending}
                onClick={() => mutate()}
                className={cn(
                  "text-blue-500 font-bold hover:text-white",
                  isPending && "cursor-wait"
                )}
              >
                {isPending ? (
                  <div className="flex items-center gap-x-2">
                    Posting...
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  "Share"
                )}
              </button>
            </div>
          )}
        </DialogHeader>
        <div
          className={cn(
            "md:py-16 flex justify-center items-center",
            step !== "caption" && "w-full px-4 md:px-0 md:w-[468px]",
            step !== "media_select" ? "h-[585px]" : "h-[300px]"
          )}
        >
          {Steps()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStatusModal;

const CaptionStep = ({
  files,
  value,
  setValue,
  isLoading = false,
}: {
  files: File[];
  value: Value;
  setValue: React.Dispatch<React.SetStateAction<Value>>;
  isLoading?: boolean;
}) => {
  const { user } = useSessionStore();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col overflow-y-auto max-h-full md:max-h-max md:flex-row">
      <div className="md:w-[468px]  flex items-center">
        <ViewCropStep files={files} />
      </div>
      <motion.div
        className="bg-neutral-800"
        {...(isMobile
          ? {}
          : {
              initial: { width: 0 },
              animate: { width: "300px" },
              exit: { width: 0 },
            })}
      >
        <div className="md:w-[300px] md:max-h-[468px] overflow-y-auto flex-1 p-4 space-y-4">
          <UserChip size="xs" user={user!} noLink />
          <div className="space-y-1">
            <label htmlFor="message" className="text-sm font-bold">
              Caption<span className="text-xs"> (optional)</span>
            </label>
            <input
              id="message"
              disabled={isLoading}
              className="w-full bg-white/5 px-2 rounded-sm outline-none border-none py-1"
              value={value.message}
              onChange={(e) =>
                setValue((p) => ({ ...p, message: e.target.value }))
              }
              placeholder="eg. My first status"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const VideoPreview = React.memo(({ src }: { src: string }) => {
  return <video src={src} controls className="w-auto h-full object-contain" />;
});

VideoPreview.displayName = "VideoPreview";
