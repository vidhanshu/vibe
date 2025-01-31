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
  useState,
} from "react";
import Dropzone from "react-dropzone";
import ConfirmDialog from "../dialogs/confirm-dialog";
import UserAvatar from "@/src/auth/components/user-avatar";
import useSessionStore from "../../stores/session-store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/src/posts/actions/posts-actions";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
interface Value {
  title: string;
  description: string;
}
const CreatePostModal = ({
  children,
  asChild = false,
}: PropsWithChildren & { asChild?: boolean }) => {
  const params = useParams();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"media_select" | "view_crop" | "caption">(
    "media_select"
  );
  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState({
    title: "",
    description: "",
  });

  const { isPending, mutate } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: async () => {
      const { message, data } = await createPost({
        title: value.title,
        content: value.description,
        medias: files,
      });
      if (message) return toast.error(message);
      return data;
    },
    onSuccess: (post) => {
      toast.success("Post created successfully");
      const keysToInvalidate = [["posts"], ["profile", params.username]];
      keysToInvalidate.forEach((q) => qc.invalidateQueries({ queryKey: q }));
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
      title: "",
      description: "",
    });
  };

  useEffect(() => {
    if (files.length === 0)
      setStep((s) => (s !== "media_select" ? "media_select" : s));
  }, [files]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={asChild} className="w-full">
        {children}
      </DialogTrigger>
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
                className="absolute top-8 right-8"
              >
                <X className="size-6" />
              </Button>
            ) : (
              <ConfirmDialog
                title="Discard post?"
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
            <DialogTitle className="text-center">Create new post</DialogTitle>
          )}
          {step === "view_crop" && (
            <div className="flex justify-between items-center">
              <ConfirmDialog
                title="Discard post?"
                subtitle="If you leave, all your edits will be lost."
                onConfirm={() => {
                  setStep((s) => (s !== "media_select" ? "media_select" : s));
                  setFiles([]);
                }}
              >
                <ArrowLeft className="size-6 cursor-pointer" />
              </ConfirmDialog>

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
              <h1>Create new post</h1>
              <button
                disabled={isPending}
                onClick={() => {
                  if (!value.title.trim().length)
                    return toast.error("Title is required");
                  else if (!value.description.trim().length)
                    return toast.error("Description is required");
                  mutate();
                }}
                className={cn(
                  "text-blue-500 font-bold hover:text-white",
                  isPending && "cursor-wait"
                )}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Share"}
              </button>
            </div>
          )}
        </DialogHeader>
        <div
          className={cn(
            "py-16 bg-neutral-800 h-[576px] flex justify-center items-center",
            step !== "caption" && "w-[576px]"
          )}
        >
          {Steps()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;

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
            "flex flex-col items-center justify-center gap-4 rounded-md border-dashed border-2 border-spacing-4 border-neutral-600 p-6 bg-transparent w-[400px]",
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

  const medias = files.map((file) => ({
    src: URL.createObjectURL(file),
    isImage: file.type.startsWith("image"),
  }));

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
          className="w-full h-auto object-contain"
        />
      );
    return <VideoPreview key={key} src={media.src} />;
  });

  return (
    <div className="flex-1 relative flex items-center h-[576px] justify-center gap-x-4 max-w-full overflow-hidden">
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
              className="p-2 bg-background/70 flex gap-x-4 w-fit overflow-y-auto"
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
                    <div key={key} className="relative">
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
                  <div className="relative" key={key}>
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
                      className="flex items-center justify-center bg-background/50 rounded-full cursor-pointer"
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
    </div>
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

  return (
    <div className="flex gap-x-2">
      <div className="w-[576px] h-[576px] flex items-center">
        <ViewCropStep files={files} />
      </div>
      <div className="w-[300px] max-h-[576px] overflow-y-auto flex-1 p-4 space-y-4">
        <div className="flex gap-x-4">
          <UserAvatar url={user?.profilePhoto?.url} /> {user?.username}
        </div>
        <input
          disabled={isLoading}
          className="w-full bg-white/5 px-2 rounded-sm outline-none border-none py-1"
          value={value.title}
          onChange={(e) => setValue((p) => ({ ...p, title: e.target.value }))}
          placeholder="eg. My first post"
        />
        <textarea
          disabled={isLoading}
          value={value.description}
          maxLength={2500}
          onChange={(e) =>
            setValue((p) => ({ ...p, description: e.target.value }))
          }
          className="bg-neutral-800 outline-none border-none resize-none min-h-[120px] px-2 py-1 bg-white/5 w-full rounded-md"
          autoCorrect="false"
          placeholder="Write a caption..."
        />
        <div className="flex justify-end items-center text-muted-foreground text-xs">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <span>{value.description.length}/2500</span>
              </TooltipTrigger>
              <TooltipContent align="end" side="bottom">
                <p>Characters after 125 will be truncated in the feed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Accordion type="multiple">
          <AccordionItem className="border-b border-white/10" value="tags">
            <AccordionTrigger
              disabled={isLoading}
              className="hover:no-underline py-2"
            >
              Tags
            </AccordionTrigger>
            <AccordionContent className="py-1 px-1">
              <p className="text-muted-foreground text-xs">
                Add tags to help people find your post
              </p>
              <h1>Feature yet to be implemented...</h1>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="border-b border-white/10" value="advance">
            <AccordionTrigger
              disabled={isLoading}
              className="hover:no-underline py-2"
            >
              Advance settings
            </AccordionTrigger>
            <AccordionContent className="py-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex gap-x-2 justify-between">
                    <h1>Hide like and view counts on this post</h1>
                    <Switch className="border border-white/10" />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Only you will see the total number of likes and views on
                    this post. You can change this later by going to the ···
                    menu at the top of the post.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-x-2 justify-between">
                    <h1>Turn off comments</h1>
                    <Switch className="border border-white/10" />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    You can change this later by going to the ··· menu at the
                    top of the post.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

const VideoPreview = React.memo(({ src }: { src: string }) => {
  return <video src={src} controls className="w-full h-auto" />;
});
