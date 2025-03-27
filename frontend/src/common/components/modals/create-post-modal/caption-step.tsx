"use client";

import useIsMobile from "@/src/common/hooks/use-is-mobile";
import useSessionStore from "@/src/common/stores/session-store";
import ViewCropStep from "./view-crop-step";
import { motion } from "framer-motion";
import UserChip from "../../user-chip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TagsSelect } from "./tag-select";

interface Value {
  title: string;
  description: string;
  hasTags: string[];
}
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
    <div className="flex flex-col overflow-y-auto max-h-full md:max-h-max md:flex-row md:gap-x-2">
      <div className="md:w-[468px] h-[585px] flex items-center">
        <ViewCropStep files={files} />
      </div>
      <motion.div
        {...(isMobile
          ? {}
          : {
              initial: { width: 0 },
              animate: { width: "300px" },
              exit: { width: 0 },
            })}
      >
        <div className="md:w-[300px] overflow-y-visible flex-1 p-4 space-y-4">
          <UserChip noLink size="xs" user={user!} />
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
          <div>
            <h2>
              Tags
              <span className="text-sm text-muted-foreground">
                &nbsp;(optional)
              </span>
            </h2>
            <p className="text-muted-foreground text-xs mb-2">
              Add tags to help people find your post
            </p>
            <TagsSelect
              selected={value.hasTags.map((e) => ({ label: e, value: e }))}
              setSelected={(selected) => {
                setValue((v) => ({
                  ...v,
                  hasTags: selected.map((e) => e.value),
                }));
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CaptionStep;
