import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

const ShowMore = ({
  text,
  limit = 150,
  className,
  endContent,
}: {
  text: string;
  limit?: number;
  className?: string;
  endContent?: React.ReactNode;
}) => {
  const [isReadMore, setIsReadMore] = React.useState(true);
  const toggleReadMore = () => {
    setIsReadMore((p) => !p);
  };

  const isExceeding = text.length > limit;
  const txString = useMemo(
    () => (isReadMore ? text.slice(0, limit) : text).replaceAll("\n", "<br/>"),
    [text, isReadMore]
  );

  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {isReadMore ? (
        <>
          <span
            dangerouslySetInnerHTML={{
              __html: txString,
            }}
          />
          {isExceeding ? "..." : endContent}
        </>
      ) : (
        <>
          <span
            dangerouslySetInnerHTML={{
              __html: txString,
            }}
          />
          {endContent}
        </>
      )}
      {isExceeding && (
        <button className="text-blue-500 ml-2" onClick={toggleReadMore}>
          {!isReadMore ? "Read less" : "Read more"}
        </button>
      )}
    </p>
  );
};

export default ShowMore;
