"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useInfinite from "@/src/common/hooks/use-infinite";
import useSessionStore from "@/src/common/stores/session-store";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { getStatuses } from "../../actions/status-action";
import StatusCircle from "./status-circle";
import StatusViewDrawer from "./status-view-drawer";

const FeedStatuses = () => {
  const { user } = useSessionStore();
  const [viewStatusIdx, setViewStatusIdx] = useState<null | number>(null); // null -> close , number -> open
  const { data, isFetchingNextPage, isLoading, ref } = useInfinite({
    queryKey: ["statuses"],
    fetcher: getStatuses,
  });

  // move my status to the top
  const allData = useMemo(() => {
    const allData = data?.map(({ items }) => items).flat();
    const myStatusId = allData?.findIndex(
      (status) => status.user.id === user?.id
    );
    if (myStatusId !== -1) {
      const myStatus = allData[myStatusId];
      allData.splice(myStatusId, 1);
      allData.unshift(myStatus);
    }
    return allData;
  }, [data, user?.id]);

  return (
    <>
      <div className="flex max-w-2xl overflow-x-auto gap-x-4">
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
          <div className="bg-secondary rounded-full size-16 flex items-center justify-center">
            <Loader2 className="animate-spin size-6" />
          </div>
        )}
      </div>
      <StatusViewDrawer
        statuses={allData}
        viewStatusIdx={viewStatusIdx}
        close={() => setViewStatusIdx(null)}
        setViewStatusIdx={setViewStatusIdx}
      />
    </>
  );
};
export default FeedStatuses;
