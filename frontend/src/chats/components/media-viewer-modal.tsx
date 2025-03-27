import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { NSChat } from "../types";
import Image from "next/image";
import { X } from "lucide-react";
import Button from "@/components/ui/button";

interface MediaViewerModalProps {
  media: NSChat.Message["media"];
  isOpen: boolean;
  onClose: () => void;
}

const MediaViewerModal = ({
  media,
  isOpen,
  onClose,
}: MediaViewerModalProps) => {
  if (!media) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        hideCloseBtn
        className="max-w-[90vw] max-h-[90vh] h-full w-full p-0 bg-transparent border-none"
      >
        <DialogTitle className="hidden"></DialogTitle>
        <Button
          size="icon-sm"
          variant="secondary"
          className="absolute top-2 right-2 z-50"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
        {media.mediaType === "IMAGE" ? (
          <div className="relative w-full h-full ">
            <Image
              fill
              src={media.url}
              alt="media-file"
              className="object-contain rounded-md"
              quality={50}
              priority
              draggable={false}
            />
          </div>
        ) : (
          <video
            controls
            autoPlay
            src={media.url}
            controlsList="nodownload"
            disablePictureInPicture
            className="w-full h-full max-h-[90vh] rounded-md"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaViewerModal;
