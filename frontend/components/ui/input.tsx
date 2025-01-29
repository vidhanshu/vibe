import * as React from "react";
import { Eye, EyeOff, Lock, LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  iconProps?: LucideProps;
  sizeVariant?: "sm" | "md" | "lg";
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

const getClassBySize = (size: InputProps["sizeVariant"]) => {
  switch (size) {
    case "sm":
      return "h-9";
    case "md":
      return "h-10";
    case "lg":
      return "h-12";
    default:
      return "h-10";
  }
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      iconProps = {},
      sizeVariant = "md",
      containerProps: { className: containerClass, ...restContainerProps } = {},
      ...props
    },
    ref
  ) => {
    const [show, setShow] = React.useState(false);
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    const { className: iconClassName, ...iconRest } = iconProps;

    if (type === "password") {
      return (
        <div
          className={cn("w-full relative", containerClass)}
          {...restContainerProps}
        >
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Lock
              size={14}
              className={cn("text-muted-foreground", iconClassName)}
              {...iconRest}
            />
          </div>
          <input
            autoComplete="off"
            type={!show ? type : "text"}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background py-2 px-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
              getClassBySize(sizeVariant),
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            type="button"
          >
            {show ? (
              <Eye
                className="stroke-slate-700/70 dark:stroke-gray-500"
                size={14}
              />
            ) : (
              <EyeOff
                className="stroke-slate-700/70 dark:stroke-gray-500"
                size={14}
              />
            )}
          </button>
        </div>
      );
    }

    return (
      <div
        className={cn("w-full relative", containerClass)}
        {...restContainerProps}
      >
        {StartIcon && (
          <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
            <StartIcon
              size={18}
              className={cn("text-muted-foreground", iconClassName)}
              {...iconRest}
            />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background py-2 px-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            startIcon ? "pl-8" : "",
            endIcon ? "pr-8" : "",
            getClassBySize(sizeVariant),
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <EndIcon
              className={cn("text-muted-foreground", iconClassName)}
              {...iconRest}
              size={18}
            />
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
