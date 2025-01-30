import SuggestedForYou from "@/src/common/components/suggested";
import React, { PropsWithChildren } from "react";

const FeedLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-x-4">
      <div className="p-8">{children}</div>
      <div className="p-8">
        <SuggestedForYou />
      </div>
    </div>
  );
};

export default FeedLayout;
