import React from "react";

const ShowMore = ({ text, limit = 150 }: { text: string; limit?: number }) => {
  const [isReadMore, setIsReadMore] = React.useState(true);
  const toggleReadMore = () => {
    setIsReadMore((p) => !p);
  };

  const isExceeding = text.length > limit;

  return (
    <p className="text-sm text-muted-foreground">
      {isReadMore ? text.slice(0, limit) + (isExceeding ? "..." : "") : text}
      {isExceeding && (
        <button className="text-blue-500 ml-2" onClick={toggleReadMore}>
          {!isReadMore ? "Read less" : "Read more"}
        </button>
      )}
    </p>
  );
};

export default ShowMore;
