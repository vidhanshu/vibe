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
import { createPost } from "@/src/posts/actions/posts-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "../../dialogs/confirm-dialog";
import ViewCropStep from "./view-crop-step";
import SelectMediaStep from "./select-media-step";
import CaptionStep from "./caption-step";
import { useUploadStore } from "@/src/common/stores/upload-store";
import uploadFileClient from "@/src/utils/upload-file-client";

export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
  const { addUpload, updateUpload } = useUploadStore();
  const [files, setFiles] = useState<File[]>([]);
  const [value, setValue] = useState({
    title: "",
    description: "",
    hasTags: [] as string[],
  });

  const { isPending, mutate } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: async () => {
      onReset();
      // Add upload tracking for UI feedback
      const uploadId = `post-${crypto.randomUUID()}`;
      addUpload(uploadId);

      try {
        // Upload files
        const uploadedFiles = await uploadFileClient(files, (e) =>
          console.log("[post->]", e)
        );
        if (!uploadedFiles) {
          console.log("no-upload-files");
          updateUpload(uploadId, "failed");
          return;
        }

        // Create status
        const { message, data } = await createPost({
          title: value.title,
          content: value.description,
          uploadedFiles: uploadedFiles,
          hashTags: value.hasTags,
        });

        if (message) {
          updateUpload(uploadId, "failed");
          return toast.error(message);
        }

        // Mark upload as completed
        const keysToInvalidate = [["posts"], ["profile", params.username]];
        keysToInvalidate.forEach((q) => qc.invalidateQueries({ queryKey: q }));
        updateUpload(uploadId, "completed");
        toast.success("Post created successfully");
        return data;
        // eslint-disable-next-line
      } catch (e) {
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
      hasTags: [],
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
        className="p-0 border-none gap-0 rounded-md overflow-hidden w-full md:max-w-max"
        overlayProps={{
          children:
            step === "media_select" || isPending ? (
              <Button
                onClick={() => setOpen(false)}
                size="icon-sm"
                className="absolute top-4 md:top-8 right-8"
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
            "md:py-16 bg-neutral-800 h-[585px] flex justify-center items-center py-0",
            step !== "caption" && "w-full px-4 md:px-0 md:w-[468px]"
          )}
        >
          {Steps()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
