import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  loading?: boolean;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary",
        destructive:
          "bg-destructive dark:bg-rose-500 text-destructive-foreground hover:bg-destructive/90 dark:hover:bg-rose-500/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        primary: "px-4 py-3",
        default: "h-10 px-4 py-2",
        xs: "h-8 text-xs rounded-md px-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 rounded-full",
        "icon-sm": "size-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      children,
      disabled,
      startContent,
      endContent,
      containerProps: { className: containerClassName, ...restProps } = {},
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn("relative", buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span>
            <Loader2 className="w-5 h-5 animate-spin absolute left-0 right-0 mx-auto" />
            {/* to keep width same as it has */}
            <div className="invisible flex gap-x-4 items-center">
              {startContent}
              {children}
              {endContent}
            </div>
          </span>
        ) : (
          <div
            className={cn("flex gap-x-4 items-center", containerClassName)}
            {...restProps}
          >
            {startContent}
            {children}
            {endContent}
          </div>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export default Button;
export { Button, buttonVariants };
