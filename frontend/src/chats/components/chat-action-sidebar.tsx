import Button from "@/components/ui/button";
import React, { useState } from "react";
import ChatUsersModal from "./chat-users-modal";
import { NSChat } from "../types";
import UserChip from "@/src/common/components/user-chip";
import { Crown, LogOut, MoreVertical, User, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSessionStore from "@/src/common/stores/session-store";
import useChatGroupActions from "../hooks/use-chat-group-actions";
import ConfirmDialog from "@/src/common/components/dialogs/confirm-dialog";
import ShowMore from "@/src/common/components/show-more";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ChatActionSidebar = ({
  chat,
  closeActionSidebar,
}: {
  chat: NSChat.Chat;
  closeActionSidebar?: () => void;
}) => {
  const [editingChat, setEditingChat] = useState(false);
  const [value, setValue] = useState({
    name: chat.name,
    description: chat.description,
  });

  const userId = useSessionStore((s) => s.user?.id);
  const {
    isAdding,
    mutateAddParticipants,
    isRemoving,
    mutateRemoveParticipant,
    isUpdating,
    mutateUpdateParticipantRole,
    isChatUpdating,
    mutateUpdateChat,
    isChatDeleting,
    mutateDeleteChat,
  } = useChatGroupActions({ chatId: chat.id });

  const myParticipant = chat.participants.find((p) => p.userId === userId);
  const isMeOwner = chat.createdById === userId;
  const isLoading =
    isAdding || isRemoving || isUpdating || isChatUpdating || isChatDeleting;

  return (
    <div className="max-w-[300px] w-full h-screen flex flex-col border-l">
      <div className="h-[65px] border-b flex justify-between items-center px-4">
        <h1 className="text-xl font-semibold">Details</h1>
        <X className="size-4 cursor-pointer" onClick={closeActionSidebar} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h1 className="font-semibold">{chat.name}</h1>
          <ShowMore className="text-xs" text={chat.description ?? ""} />
        </div>
        {myParticipant?.role === "ADMIN" && (
          <div className="flex justify-between items-center py-4 px-4 border-b">
            <span className="font-semibold">Change group info</span>
            <Dialog open={editingChat} onOpenChange={setEditingChat}>
              <DialogTrigger asChild>
                <Button loading={isLoading} size="sm" variant="secondary">
                  Change
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Group Info</DialogTitle>
                  <DialogDescription>
                    Edit the name and description of your chat group to keep
                    your members informed and up-to-date.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="font-semibold">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter group name..."
                      value={value.name}
                      autoFocus
                      onChange={(e) =>
                        setValue((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="desc" className="font-semibold">
                      Description
                    </Label>
                    <Textarea
                      id="desc"
                      rows={4}
                      maxLength={800}
                      placeholder="Enter group description..."
                      className="resize-none"
                      value={value.description}
                      onChange={(e) =>
                        setValue((p) => ({ ...p, description: e.target.value }))
                      }
                    />
                    <div className="ml-auto w-fit text-xs text-muted-foreground">
                      {value.description?.length}/800
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    disabled={
                      value.name === chat.name &&
                      value.description === chat.description
                    }
                    onClick={async () => {
                      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                      const payload: any = {};
                      if (value.name !== chat.name) {
                        payload.name = value.name;
                      }
                      if (
                        value.description &&
                        value.description !== chat.description
                      ) {
                        payload.description = value.description;
                      }
                      if (Object.keys(payload).length == 0)
                        return toast.error(
                          "Group name/description cannot be empty"
                        );

                      await mutateUpdateChat(payload);
                      setEditingChat(false);
                    }}
                    type="button"
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <div className="flex justify-between py-4 px-4">
          <span className="font-semibold">Members</span>
          {myParticipant?.role === "ADMIN" && (
            <ChatUsersModal
              dialogTitle="Add people"
              usersToExclude={chat?.participants.map((p) => p.userId)}
              onSelect={async (users) => {
                await mutateAddParticipants(users);
              }}
              loading={isLoading}
              multiSelect
            >
              <button className="font-semibold text-blue-500 text-sm">
                Add people
              </button>
            </ChatUsersModal>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-2">
          <div className="space-y-4">
            {chat?.participants.map((p) => (
              <UserChip
                size="md"
                key={p.user.id}
                user={{
                  ...p.user,
                  name: p.user.name
                    ? `${p.user.name} (${
                        p.userId === chat.createdById
                          ? "Owner"
                          : p.role === "ADMIN"
                          ? "Admin"
                          : "Member"
                      })`
                    : p.userId === chat.createdById
                    ? "Group Owner"
                    : p.role === "ADMIN"
                    ? "Group Admin"
                    : "Group Member",
                }}
                className="w-full hover:bg-secondary p-1 rounded-sm"
                linkProps={{ target: "_blank" }}
                endContent={
                  p.userId != userId &&
                  myParticipant?.role === "ADMIN" &&
                  p.userId !== chat.createdById && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            endContent={<MoreVertical className="size-4" />}
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Member action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-rose-500 hover:text-rose-600"
                                onSelect={(e) => {
                                  e.preventDefault();
                                }}
                              >
                                <LogOut className="mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Member
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {p.user.name}{" "}
                                  from this chat? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  disabled={isLoading}
                                  onClick={async () =>
                                    await mutateRemoveParticipant({
                                      userId: p.id,
                                    })
                                  }
                                  className="bg-rose-500 hover:bg-rose-600"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {p.role === "MEMBER" ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Crown className="mr-2" /> Make Admin
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Make Admin
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to make {p.user.name}{" "}
                                    an admin? They will have full control over
                                    the chat.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    disabled={isLoading}
                                    onClick={async () =>
                                      await mutateUpdateParticipantRole({
                                        userId: p.id,
                                        role: "ADMIN",
                                      })
                                    }
                                  >
                                    Make Admin
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <User className="mr-2" /> Make Member
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Remove Admin Rights
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove admin rights
                                    from {p.user.name}? They will no longer have
                                    administrative control.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    disabled={isLoading}
                                    onClick={async () =>
                                      await mutateUpdateParticipantRole({
                                        userId: p.id,
                                        role: "MEMBER",
                                      })
                                    }
                                  >
                                    Make Member
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-4">
        <ConfirmDialog
          title="Are you sure you want to leave this group?"
          subtitle="Leaving this group will remove you from all the conversations and you will no longer receive any updates from this group."
          onConfirm={async () => {
            if (myParticipant) {
              await mutateRemoveParticipant({
                userId: myParticipant.id,
                isLeavingGroup: true,
              });
              closeActionSidebar?.();
            }
          }}
        >
          <button
            disabled={isLoading}
            className="block text-rose-500 disabled:text-muted-foreground font-medium text-base"
          >
            Leave Chat
          </button>
        </ConfirmDialog>
        {isMeOwner && (
          <ConfirmDialog
            title="Are you sure you want to delete this group?"
            subtitle="This action is permanent and cannot be undone. All chat history and data will be lost, the members of the group won't be notified about this."
            onConfirm={async () => {
              if (myParticipant) {
                await mutateDeleteChat();
                closeActionSidebar?.();
              }
            }}
          >
            <button
              disabled={isLoading}
              className="block text-rose-500 disabled:text-muted-foreground font-medium text-base"
            >
              Delete Chat
            </button>
          </ConfirmDialog>
        )}
      </div>
    </div>
  );
};

export default ChatActionSidebar;
