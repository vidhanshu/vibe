/**
 * Not re-usable, just to extract logic separate
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import { NSChat } from "../types";

const useMessageContainerScroll = ({
  isFetchingNextPage,
  messages,
}: {
  isFetchingNextPage: boolean;
  messages: NSChat.Message[];
}) => {
  const shouldAutoScrollRef = useRef(true);
  const prevScrollHeight = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialScrollDone = useRef(false);

  // To scroll to the extreme bottom on first load
  // TODO: On page refresh it doesn't scroll the extreme bottom
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (!initialScrollDone.current && messages.length && !isFetchingNextPage) {
      const observer = new MutationObserver(() => {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
          initialScrollDone.current = true;
          observer.disconnect();
        });
      });

      observer.observe(el, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
  }, [messages.length, isFetchingNextPage]);

  // to preserve the scroll when fetching new messages, by default it will be at the top loosing all infinite scroll effect
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (!isFetchingNextPage && prevScrollHeight.current) {
      const newScrollHeight = el.scrollHeight;
      const delta = newScrollHeight - prevScrollHeight.current;

      // 🟢 Set scrollTop AFTER new messages are prepended
      requestAnimationFrame(() => {
        el.scrollTop = delta;
        prevScrollHeight.current = 0;
      });
    }
  }, [messages.length, isFetchingNextPage]);

  // Add scroll tracking to detect if user is near bottom
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      shouldAutoScrollRef.current = distanceFromBottom < 300;
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // to scroll to the bottom if near bottom
  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      // Scroll after DOM is fully updated with new nodes
      if (shouldAutoScrollRef.current) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: "smooth",
        });
      }
    });

    observer.observe(el, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return {
    scrollContainerRef,
    prevScrollHeight,
  };
};

export default useMessageContainerScroll;
