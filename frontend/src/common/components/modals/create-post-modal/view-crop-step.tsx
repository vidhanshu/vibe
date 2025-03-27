"use client";
import Button from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import Dropzone from "react-dropzone";
import { MAX_FILE_SIZE, MAX_FILES } from "./create-post-modal";

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
          width={468}
          height={585}
          className="object-contain aspect-auto h-[585px] w-auto md:w-[468px]"
        />
      );
    return <VideoPreview key={key} src={media.src} />;
  });

  return (
    <motion.div className="flex-1 relative flex md:flex-row items-center h-[585px] justify-center gap-x-4 max-w-full overflow-hidden md:border-r border-white/10">
      {mediaElements[active]}
      {medias.length > 1 && (
        <>
          <ChevronLeft
            className="text-black cursor-pointer bg-white rounded-full absolute inset-y-0 m-auto left-4 p-1 shadow-md"
            onClick={() =>
              setActive((act) => {
                if (act === 0) return medias.length - 1;
                return act - 1;
              })
            }
          />
          <ChevronRight
            className="text-black cursor-pointer bg-white rounded-full absolute inset-y-0 m-auto right-4 p-1 shadow-md"
            onClick={() => setActive((active + 1) % medias.length)}
          />

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
                  <X
                    className="text-black cursor-pointer bg-white rounded-full absolute -top-2 -right-2 size-5 stroke-1 p-1 shadow-md"
                    onClick={() => {
                      setFiles((files) => {
                        const newFiles = [...files];
                        newFiles.splice(key, 1);
                        return newFiles;
                      });
                    }}
                  />
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

export default ViewCropStep;

const VideoPreview = React.memo(({ src }: { src: string }) => {
  return (
    <video
      src={src}
      controls
      controlsList="nodownload nofullscreen"
      disablePictureInPicture
      className="h-full aspect-auto object-contain"
    />
  );
});

VideoPreview.displayName = "VideoPreview";
