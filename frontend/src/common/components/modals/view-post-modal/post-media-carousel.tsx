import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NSCommon } from "@/src/common/types";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

const PostMediaCarousel = ({
  title,
  medias,
  imageClassName,
  videoClassName,
  containerClassName,
}: {
  title: string;
  medias: NSCommon.FullMedia[];
  imageClassName?: string;
  videoClassName?: string;
  containerClassName?: string;
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
          className={cn(
            "w-full max-h-[calc(100vh-100px)] object-cover object-center",
            imageClassName
          )}
        />
      );
    return (
      <VideoPreview key={key} src={media.url} videoClassName={videoClassName} />
    );
  });

  return (
    <div
      className={cn(
        "col-span-7 flex items-center justify-center border-r relative",
        containerClassName
      )}
    >
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

const VideoPreview = React.memo(
  ({ src, videoClassName }: { src: string; videoClassName?: string }) => {
    const [play, setPlay] = useState(false);
    const [mute, setMute] = useState(false);
    const [progress, setProgress] = useState("0");
    const [visible, setVisible] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
      if (play) {
        videoRef.current?.play();
      } else {
        videoRef.current?.pause();
      }
    }, [play]);

    React.useEffect(() => {
      if (!videoRef.current) return;
      if (mute) {
        videoRef.current.muted = true;
      } else {
        videoRef.current.muted = false;
      }
    }, [mute]);

    const togglePlay = () => {
      setPlay((e) => !e);
      setVisible(true);
      if (!play) {
        setTimeout(() => setVisible(false), 1000);
      }
    };

    const toggleMute = () => {
      setMute((e) => !e);
    };

    const TOTAL_DURATION = videoRef.current?.duration;

    // % = (ct * 100 / total time)
    // ct = % * total time / 100

    return (
      <div className="relative">
        <div className="w-fit relative" onClick={togglePlay}>
          <video
            loop
            src={src}
            ref={videoRef}
            controls={false}
            className={cn(
              "max-h-[calc(100vh-100px)] object-contain object-center",
              videoClassName
            )}
            onTimeUpdate={(e) => {
              console.log(e.currentTarget.currentTime);
              const pr = (e.currentTarget.currentTime / TOTAL_DURATION!) * 100;
              setProgress(pr.toFixed(0));
            }}
          />
          <button
            className={cn(
              "absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-opacity",
              visible ? "opacity-100" : "opacity-0"
            )}
          >
            {play ? (
              <Pause className="size-12 fill-white" />
            ) : (
              <Play className="size-12 fill-white" />
            )}
          </button>
        </div>
        <input
          className="w-full absolute bottom-0"
          value={progress}
          onChange={(e) => {
            setProgress(e.target.value);
            if (videoRef.current && TOTAL_DURATION) {
              videoRef.current.currentTime =
                (Number(e.target.value) * TOTAL_DURATION) / 100;
            }
          }}
          type="range"
        />
        <Button
          onClick={toggleMute}
          className="absolute right-4 bottom-4"
          variant="ghost"
          size="icon-sm"
          endContent={
            mute ? (
              <VolumeX className="size-6" />
            ) : (
              <Volume2 className="size-6" />
            )
          }
        />
      </div>
    );
  }
);

VideoPreview.displayName = "VideoPreview";
