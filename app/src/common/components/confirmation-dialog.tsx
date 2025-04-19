import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import React, { PropsWithChildren } from "react";

export default function ConfirmationDialog({
  open,
  setOpen,
  cancelButtonText = "cancel",
  confirmButtonText = "Confirm",
  title = "Are you sure?",
  description = "This action is irreversible, please proceed with caution.",
  onConfirm,
  onCancel,
  children,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  cancelButtonText?: string;
  confirmButtonText?: string;
} & PropsWithChildren) {
  return (
    <>
      {children}
      <AlertDialog isOpen={open} onClose={() => setOpen(false)} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              {title}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">{description}</Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setOpen(false);
                onCancel?.();
              }}
              size="sm"
            >
              <ButtonText>{cancelButtonText}</ButtonText>
            </Button>
            <Button size="sm" onPress={onConfirm}>
              <ButtonText>{confirmButtonText}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
