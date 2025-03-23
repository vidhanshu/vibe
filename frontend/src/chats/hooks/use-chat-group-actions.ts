import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  addParticipants,
  deleteChat,
  removeParticipant,
  updateChat,
  updateParticipant,
} from "../actions/chats-action";
import { toast } from "sonner";
import { NSChat } from "../types";
import useSessionStore from "@/src/common/stores/session-store";

const useChatGroupActions = ({ chatId }: { chatId: string }) => {
  const qc = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["add-participants", chatId],
    mutationFn: async (userIds: string[]) => {
      const res = await addParticipants({
        chatId: chatId,
        participantIds: userIds,
      });
      if (res.message) {
        return toast.error(res.message);
      }
      toast.success(
        `${userIds.length} Participant${
          userIds.length ? "s" : ""
        } added to chat`
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat", chatId] });
    },
  });

  const { isPending: isRemoving, mutateAsync: mutateRemoveParticipant } =
    useMutation({
      mutationKey: ["remove-participant", chatId],
      mutationFn: async ({
        userId,
        isLeavingGroup,
      }: {
        userId: string;
        isLeavingGroup?: boolean;
      }) => {
        const res = await removeParticipant({
          chatId: chatId,
          participantId: userId,
        });
        if (res.message) {
          return toast.error(res.message);
        }
        toast.success("Participant removed from chat");
        if (isLeavingGroup) {
          qc.invalidateQueries({ queryKey: ["chats"] });
        }
        qc.invalidateQueries({ queryKey: ["chat", chatId] });
      },
      onSuccess: () => {},
    });

  const { isPending: isUpdating, mutateAsync: mutateUpdateParticipantRole } =
    useMutation({
      mutationKey: ["remove-participant", chatId],
      mutationFn: async ({
        userId,
        role,
      }: {
        userId: string;
        role: NSChat.ChatGroupRole;
      }) => {
        const res = await updateParticipant({
          chatId: chatId,
          participantId: userId,
          role,
        });
        if (res.message) {
          return toast.error(res.message);
        }
        toast.success("Participant updated");
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["chat", chatId] });
      },
    });
  const { isPending: isChatUpdating, mutateAsync: mutateUpdateChat } =
    useMutation({
      mutationKey: ["chat-update", chatId],
      mutationFn: async ({
        name,
        description,
      }: {
        name?: string;
        description?: string;
      }) => {
        const res = await updateChat({
          chatId: chatId,
          name,
          description,
        });
        if (res.message) {
          return toast.error(res.message);
        }
        toast.success("Chat updated");
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["chat", chatId] });
        qc.invalidateQueries({ queryKey: ["chats"] });
      },
    });
  const { isPending: isChatDeleting, mutateAsync: mutateDeleteChat } =
    useMutation({
      mutationKey: ["chat-update", chatId],
      mutationFn: async () => {
        const res = await deleteChat({
          chatId,
        });
        if (res.message) {
          return toast.error(res.message);
        }
        toast.success("Chat deleted");
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["chats"] });
      },
    });

  return {
    isAdding: isPending,
    mutateAddParticipants: mutateAsync,
    isRemoving,
    mutateRemoveParticipant,
    isUpdating,
    mutateUpdateParticipantRole,
    isChatUpdating,
    mutateUpdateChat,
    isChatDeleting,
    mutateDeleteChat,
  };
};

export default useChatGroupActions;
