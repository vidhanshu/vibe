import Dropzone from "react-dropzone";
import { MAX_FILE_SIZE, MAX_FILES } from "./create-post-modal";
import { Images } from "lucide-react";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SelectMediaStep = ({ onDrop }: { onDrop: (files: File[]) => void }) => {
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

export default SelectMediaStep;
