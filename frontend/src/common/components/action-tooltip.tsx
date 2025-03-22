import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContentProps } from "@radix-ui/react-tooltip";
import { PropsWithChildren } from "react";

const ActionTooltip = ({
  children,
  content,
  ...rest
}: { content: React.ReactNode } & TooltipContentProps & PropsWithChildren) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...rest}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
