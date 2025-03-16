"use client";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import UserAvatar from "@/src/auth/components/user-avatar";
import { createStatus } from "@/src/feed/actions/status-action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Images,
  Loader2,
  PlusCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import useIsMobile from "../../hooks/use-is-mobile";
import useSessionStore from "../../stores/session-store";
import ConfirmDialog from "../dialogs/confirm-dialog";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
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

  const { isPending, mutate } = useMutation({
    mutationKey: ["create-status"],
    mutationFn: async () => {
      const { message, data } = await createStatus({
        message: value.message,
        backgroundColor: value.backgroundColor,
        medias: files,
      });
      if (message) return toast.error(message);
      return data;
    },
    onSuccess: () => {
      toast.success("Status added successfully");
      qc.invalidateQueries({ queryKey: ["statuses"] });
      onReset();
    },
  });

  const Steps = () => {
    switch (step) {
      case "media_select":
        return <UploadMediaStep onDrop={onDrop} />;
      case "view_crop":
        return <ViewCropStep files={files} setFiles={setFiles} />;
      case "caption":
        return (
          <CaptionStep
            isLoading={isPending}
            files={files}
            value={value}
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
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="p-0 border-none gap-0 rounded-md overflow-hidden max-w-max"
        overlayProps={{
          children:
            step === "media_select" || isPending ? (
              <Button
                loading={isPending}
                onClick={() => setOpen(false)}
                size="icon-sm"
                className="absolute md:top-8 right-8"
              >
                <X className="size-6" />
              </Button>
            ) : (
              <ConfirmDialog
                title="Discard status?"
                subtitle="If you leave, all your edits will be lost."
                onConfirm={onReset}
              >
                <Button size="icon-sm" className="absolute top-8 right-8">
                  <X className="size-6" />
                </Button>
              </ConfirmDialog>
            ),
        }}
      >
        <DialogHeader className="p-4 bg-black border-b border-neutral-700">
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
              <h1>View and crop</h1>
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
              <h1>Add to status</h1>
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
            "md:py-16 h-[576px] flex justify-center items-center",
            step !== "caption" && "w-full px-4 md:px-0 md:w-[576px]"
          )}
          style={{ background: value.backgroundColor }}
        >
          {Steps()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStatusModal;

// steps
const UploadMediaStep = ({ onDrop }: { onDrop: (files: File[]) => void }) => {
  return (
    <Dropzone
      maxSize={MAX_FILE_SIZE}
      maxFiles={MAX_FILES}
      accept={{ "image/*": [], "video/*": [] }}
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center gap-4 rounded-md border-dashed border-2 border-spacing-4 border-neutral-600 p-6 bg-transparent md:w-[400px]",
            isDragReject && "bg-primary/20",
            isDragAccept && "bg-blue-500/20"
          )}
        >
          <input {...getInputProps()} />
          <Images className="size-16 stroke-1" />
          <div className="text-center">
            <h1 className="text-lg font-semibold">
              Drag photos and videos here
            </h1>
            {isDragReject && (
              <p className="text-xs">
                Max file size allowed: 30MB, files allowed: images/videos
              </p>
            )}
          </div>
          <Button size="sm">Select from computer</Button>
        </div>
      )}
    </Dropzone>
  );
};

const ViewCropStep = ({
  files,
  setFiles,
}: {
  files: File[];
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>;
}) => {
  const [active, setActive] = useState(0);

  const medias = useMemo(
    () =>
      files.map((file) => ({
        src: URL.createObjectURL(file),
        isImage: file.type.startsWith("image"),
      })),
    [files]
  );

  // Function to handle adding new files
  const handleAddFiles = useCallback(
    (newFiles: File[]) => {
      setFiles?.((prevFiles) => {
        const combinedFiles = [...prevFiles, ...newFiles].slice(0, MAX_FILES);
        return combinedFiles;
      });
    },
    [setFiles]
  );

  const mediaElements = medias.map((media, key) => {
    if (media.isImage)
      return (
        <Image
          key={key}
          src={media.src}
          alt="image"
          width={500}
          height={500}
          className="w-auto h-auto object-contain"
        />
      );
    return <VideoPreview key={key} src={media.src} />;
  });

  return (
    <motion.div
      // initial={{ x: 200 }}
      // animate={{ x: 0 }}
      className="flex-1 relative flex md:flex-row items-center h-[576px] justify-center gap-x-4 max-w-full overflow-hidden md:border-r border-white/10"
    >
      {mediaElements[active]}
      {medias.length > 1 && (
        <>
          <Button
            onClick={() =>
              setActive((act) => {
                if (act === 0) return medias.length - 1;
                return act - 1;
              })
            }
            className="absolute inset-y-0 m-auto left-4"
            variant="secondary"
            size="icon-sm"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={() => setActive((active + 1) % medias.length)}
            className="absolute inset-y-0 m-auto right-4"
            variant="secondary"
            size="icon-sm"
          >
            <ChevronRight />
          </Button>
          {/* indicators */}
          <div className="w-fit flex gap-x-2 items-center absolute inset-x-0 mx-auto bottom-4">
            {Array.from({ length: medias.length }).map((_, key) => (
              <div
                key={key}
                onClick={() => setActive(key)}
                className={cn(
                  "size-2 rounded-full bg-white cursor-pointer",
                  key === active && "bg-blue-500"
                )}
              />
            ))}
          </div>
        </>
      )}
      {setFiles && (
        <div className="absolute right-4 bottom-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="icon-sm">
                <Images className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              side="top"
              className="p-2 bg-background/70 flex gap-x-4 md:w-fit overflow-y-auto max-w-screen"
            >
              {medias.map(({ isImage, src }, key) => {
                const closeButton = (
                  <Button
                    onClick={() => {
                      setFiles((files) => {
                        const newFiles = [...files];
                        newFiles.splice(key, 1);
                        return newFiles;
                      });
                    }}
                    className="absolute -top-2 -right-2 size-6"
                    variant="secondary"
                    size="icon-sm"
                  >
                    <X className="size-4 stroke-1" />
                  </Button>
                );
                if (!isImage) {
                  return (
                    <div key={key} className="relative cursor-pointer">
                      <div
                        onClick={() => setActive(key)}
                        className="w-[100px] h-[100px] flex items-center justify-center bg-background/80 rounded-md"
                      >
                        Video
                      </div>
                      {closeButton}
                    </div>
                  );
                }
                return (
                  <div className="relative cursor-pointer" key={key}>
                    <Image
                      onClick={() => setActive(key)}
                      src={src}
                      alt="image"
                      width={100}
                      height={100}
                      className="rounded-md object-cover aspect-square"
                    />
                    {closeButton}
                  </div>
                );
              })}
              {files.length < MAX_FILES && (
                <Dropzone
                  maxSize={MAX_FILE_SIZE}
                  maxFiles={MAX_FILES - files.length}
                  accept={{ "image/*": [], "video/*": [] }}
                  onDrop={handleAddFiles}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Button
                      {...getRootProps()}
                      size="icon-sm"
                      variant="secondary"
                      className="flex items-center justify-center bg-background/50 rounded-full cursor-pointer p-1 md:p-0 h-fit md:h-9"
                    >
                      <input {...getInputProps()} />
                      <PlusCircle className="stroke-1 size-6 text-white" />
                    </Button>
                  )}
                </Dropzone>
              )}
            </PopoverContent>
          </Popover>
        </div>
      )}
    </motion.div>
  );
};

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
    <div className="flex flex-col border overflow-y-auto max-h-full md:max-h-max md:flex-row">
      <div className="md:w-[576px]  flex items-center">
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
        <div className="md:w-[300px] md:max-h-[576px] overflow-y-auto flex-1 p-4 space-y-4">
          <div className="flex gap-x-4">
            <UserAvatar url={user?.profilePhoto?.url} /> {user?.username}
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-bold">
              Caption
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
          <div className="flex gap-x-2 items-center">
            <label
              htmlFor="backgroundColor"
              className="text-sm font-bold flex items-center gap-x-4"
            >
              Background
              <div
                className="h-6 w-12 rounded-sm border border-white/50"
                style={{ backgroundColor: value.backgroundColor }}
              />
            </label>
            <input
              className="invisible"
              id="backgroundColor"
              type="color"
              value={value.backgroundColor}
              onChange={(e) =>
                setValue((p) => ({ ...p, backgroundColor: e.target.value }))
              }
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
