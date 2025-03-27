"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useInfinite from "@/src/common/hooks/use-infinite";
import useSessionStore from "@/src/common/stores/session-store";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getStatuses } from "../../actions/status-action";
import StatusCircle from "./status-circle";
import StatusViewDrawer from "./status-view-drawer";
import Button from "@/components/ui/button";

const FeedStatuses = () => {
  const { user } = useSessionStore();
  const statusContainerRef = useRef<HTMLDivElement>(null);
  const [viewStatusIdx, setViewStatusIdx] = useState<null | number>(null); // null -> close , number -> open
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const { data, isFetchingNextPage, isLoading, ref } = useInfinite({
    queryKey: ["statuses"],
    fetcher: getStatuses,
  });

  const allData = useMemo(
    () => data?.map(({ items }) => items).flat(),
    [data, user?.id]
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setShowLeft(target.scrollLeft > 0);
    setShowRight(target.scrollLeft < target.scrollWidth - target.clientWidth);
  };

  // Scroll Left & Right Functions
  const scrollLeft = () => {
    if (statusContainerRef.current) {
      statusContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (statusContainerRef.current) {
      statusContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative px-4 md:px-0">
      <div
        ref={statusContainerRef}
        onScroll={handleScroll}
        className="flex max-w-[38rem] overflow-x-auto gap-x-4 hide-scrollbar mx-auto"
      >
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="size-16 min-w-16 rounded-full" />
          ))
        ) : allData.length === 0 ? (
          <StatusCircle
            idx={0}
            onlyCreate
            selectStatus={(idx) => setViewStatusIdx(idx)}
          />
        ) : (
          allData.map((status, idx) => {
            return (
              <StatusCircle
                selectStatus={(idx) => setViewStatusIdx(idx)}
                key={idx}
                idx={idx}
                status={status}
              />
            );
          })
        )}
        <div ref={ref} />
        {isFetchingNextPage && (
          <div className="h-16 w-8 flex items-center justify-center">
            <Loader2 className="animate-spin size-6" />
          </div>
        )}
      </div>
      {showLeft && (
        <ChevronLeft
          className="text-black cursor-pointer bg-white rounded-full absolute left-4 top-[1.4rem] p-1 shadow-md"
          onClick={scrollLeft}
        />
      )}
      {showRight && allData.length > 7 && (
        <ChevronRight
          className="text-black cursor-pointer bg-white rounded-full absolute right-[4.7rem] top-[1.4rem] p-1 shadow-md"
          onClick={scrollRight}
        />
      )}
      <StatusViewDrawer
        statuses={allData}
        viewStatusIdx={viewStatusIdx}
        close={() => setViewStatusIdx(null)}
        setViewStatusIdx={setViewStatusIdx}
      />
    </div>
  );
};
export default FeedStatuses;
