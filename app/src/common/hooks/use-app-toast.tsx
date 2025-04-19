import { Box } from "@/components/ui/box";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";

type ToastType = "success" | "error" | "info" | "warning";
const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case "success":
      return <AntDesign name="checkcircle" size={16} color="white" />;
    case "error":
      return <MaterialIcons name="error" size={16} color="white" />;
    case "warning":
      return <FontAwesome name="warning" size={16} color="white" />;
    case "info":
      return <FontAwesome name="info-circle" size={16} color="white" />;
    default:
      return null;
  }
};

export default function useAppToast({
  variant = "outline",
}: {
  variant?: "outline" | "solid";
}) {
  const toast = useToast();

  const show = (type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString();

    toast.show({
      id,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action={type} variant={variant}>
            <Box className="flex flex-row items-center justify-center gap-x-2">
              <ToastIcon type={type} />
              <ToastTitle>{title}</ToastTitle>
            </Box>
            {description && <ToastDescription>{description}</ToastDescription>}
          </Toast>
        );
      },
    });
  };

  return {
    success: (title: string, description?: string) =>
      show("success", title, description),
    error: (title: string, description?: string) =>
      show("error", title, description),
    info: (title: string, description?: string) =>
      show("info", title, description),
    warning: (title: string, description?: string) =>
      show("warning", title, description),
  };
}
