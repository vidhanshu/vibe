import { useMediaQuery } from "usehooks-ts";

const useIsMobile = () => {
  return useMediaQuery("(max-width: 768px)");
};

export default useIsMobile;
