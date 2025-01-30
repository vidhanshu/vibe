import { Camera, LucideIcon } from "lucide-react";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

const NoContent = ({
  icon: Icon = Camera,
  title = "Share photos",
  subtitle = "When you share photos, they will appear on your profile.",
  link = "",
  linkText = "Share photos",
  onClick,
  children,
}: {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  link?: string;
  linkText?: string;
  onClick?: () => void;
} & PropsWithChildren) => {
  return (
    <div className="mx-auto max-w-[300px] text-center flex flex-col items-center gap-4">
      <div className="size-16 border-white border-[1px] rounded-full flex items-center justify-center p-2">
        <Icon className="size-8 stroke-[1]" />
      </div>
      <h1 className="text-4xl font-bold">{title}</h1>
      <p>{subtitle}</p>
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
