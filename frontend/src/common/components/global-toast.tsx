"use client";

import { Toaster } from "sonner";
import useIsMobile from "../hooks/use-is-mobile";

const GlobalToast = () => {
  const isMobile = useIsMobile();
  return (
    <>
      <Toaster
        icons={{
          success: "✅",
          error: "❌",
          close: "✕",
          info: "ℹ️",
          loading: "⏳",
          warning: "⚠️",
        }}
        closeButton
        theme="dark"
        duration={3000}
        richColors
        position={isMobile ? "top-right" : "bottom-right"}
      />
    </>
  );
};

export default GlobalToast;
