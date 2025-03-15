import SuggestedForYou from "@/src/common/components/suggested";
import { PropsWithChildren } from "react";

const FeedLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="md:grid md:grid-cols-[1fr_400px] gap-x-4">
      <div className="p-4 md:p-8">{children}</div>
      <div className="p-8 hidden md:block">
        <SuggestedForYou />
      </div>
    </div>
  );
};

export default FeedLayout;
