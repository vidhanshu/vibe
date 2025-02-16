import Button from "@/components/ui/button";
import { NSCommon } from "@/src/common/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const PostMediaCarousel = ({
  title,
  medias,
}: {
  title: string;
  medias: NSCommon.FullMedia[];
}) => {
  const [active, setActive] = useState(0);
  const LENGTH = medias.length;

  const mediaElements = medias.map((media, key) => {
    if (media.mediaType === "IMAGE")
      return (
        <Image
          key={key}
          src={media.url}
          alt={title}
          width={500}
          height={500}
          className="w-[calc(100%-20px)] max-h-[calc(100vh-100px)] object-contain object-center"
        />
      );
    return <VideoPreview key={key} src={media.url} />;
  });

  return (
    <div className="col-span-7 flex items-center justify-center border-r  relative">
      {mediaElements[active]}
      {LENGTH > 1 && (
        <>
          <Button
            size="icon-sm"
            variant="secondary"
            className="absolute inset-y-0 my-auto left-4"
            onClick={() => setActive((prev) => (prev - 1 + LENGTH) % LENGTH)}
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon-sm"
            variant="secondary"
            className="absolute inset-y-0 my-auto right-4"
            onClick={() => setActive((prev) => (prev + 1) % LENGTH)}
          >
            <ChevronRight />
          </Button>
        </>
      )}
    </div>
  );
};

export default PostMediaCarousel;

const VideoPreview = React.memo(({ src }: { src: string }) => {
  return <video src={src} controls className="w-full h-auto" />;
});
