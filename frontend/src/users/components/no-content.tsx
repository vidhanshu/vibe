import { cn } from "@/lib/utils";
import { Camera, LucideIcon } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

const NoContent = ({
  icon: Icon = Camera,
  title = "Share photos",
  subtitle = "When you share photos, they will appear on your profile.",
  link = "",
  linkText = "Share photos",
  onClick,
  children,
  titleClassName,
  subtitleClassName,
  iconContainerClassName,
  containerClassName,
  iconClassName,
  size = "sm",
}: {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  link?: string;
  linkText?: string;
  onClick?: () => void;
  titleClassName?: string;
  subtitleClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  containerClassName?: string;
  size?: "sm" | "lg";
} & PropsWithChildren) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-[300px] text-center flex flex-col items-center",
        size === "sm" ? "gap-1" : "gap-4",
        containerClassName
      )}
    >
      <div
        className={cn(
          size === "sm"
            ? "size-8 border-white border-[1px] rounded-full flex items-center justify-center p-1"
            : "size-16 border-white border-[1px] rounded-full flex items-center justify-center p-2",
          iconContainerClassName
        )}
      >
        <Icon
          className={cn(
            size === "sm" ? "size-6" : "size-8 stroke-[1]",
            iconClassName
          )}
        />
      </div>
      <h1
        className={cn(
          size === "sm" ? "text-xl font-bold" : "text-4xl font-bold",
          titleClassName
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          size === "sm" ? "text-muted-foreground text-sm" : "",
          subtitleClassName
        )}
      >
        {subtitle}
      </p>
      {link && (
        <Link className="text-blue-500" href={link}>
          {linkText}
        </Link>
      )}
      {onClick && (
        <button className="text-blue-500" onClick={onClick}>
          {linkText}
        </button>
      )}
      {children}
    </div>
  );
};

export default NoContent;
