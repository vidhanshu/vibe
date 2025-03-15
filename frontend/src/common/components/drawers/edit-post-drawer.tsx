"use client";

import Button from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updatePost } from "@/src/posts/actions/posts-actions";
import { NSPost } from "@/src/posts/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditPostDrawer = ({
  cancelEdit,
  postToEdit,
  editPostId,
}: {
  editPostId: string | null;
  postToEdit: NSPost.Post;
  cancelEdit: () => void;
}) => {
  const qc = useQueryClient();
  const [value, setValue] = useState({ title: "", content: "" });
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      if (!editPostId) return undefined;
      const res = await updatePost(editPostId, value.title, value.content);
      if (res.message) toast.error(res.message);
      else toast.success("Post updated successfully");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      cancelEdit();
    },
  });

  useEffect(() => {
    if (postToEdit) {
      setValue({ title: postToEdit.title, content: postToEdit.content });
    }
  }, [postToEdit]);

  return (
    <Drawer open={!!editPostId} onClose={cancelEdit}>
      <DrawerContent className="max-w-lg mx-auto">
        <DrawerHeader>
          <DrawerTitle>Editing &ldquo;{postToEdit?.title}&rdquo;</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <Input
            disabled={isPending}
            type="text"
            placeholder="eg. My first post"
            value={value.title}
            onChange={(e) => setValue({ ...value, title: e.target.value })}
          />
          <Textarea
            disabled={isPending}
            maxLength={2500}
            value={value.content}
            autoCorrect="false"
            placeholder="Write a caption..."
            onChange={(e) => setValue({ ...value, content: e.target.value })}
            className="max-h-[100px] resize-none"
          />
          <div className="flex justify-end items-center text-muted-foreground text-xs">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <span>{value.content.length}/2500</span>
                </TooltipTrigger>
                <TooltipContent align="end" side="bottom">
                  <p>Characters after 125 will be truncated in the feed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <DrawerFooter className="flex flex-row justify-end gap-4 items-center">
          <Button
            onClick={() => {
              if (!value.title.trim().length)
                return toast.error("Please enter title");
              if (!value.content.trim().length)
                return toast.error("Please enter description");
              if (value.content.trim().length > 2500)
                return toast.error(
                  "Description can't be more than 2500 characters"
                );
              mutate();
            }}
            loading={isPending}
          >
            Submit
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" loading={isPending}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EditPostDrawer;
