"use client";

import Button from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/src/auth/components/user-avatar";
import { uploadFiles } from "@/src/common/actions/file-actions";
import useSessionStore from "@/src/common/stores/session-store";
import { NSCommon } from "@/src/common/types";
import { updateProfile } from "@/src/users/actions/user-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const userFormSchema = z.object({
  pronoun: z.enum(["he", "she", "they"]),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  bio: z.string().max(150),
});

type UpdateUserValues = z.infer<typeof userFormSchema>;

const EditPage = () => {
  const [profileChangeModalOpen, setProfileChangeModalOpen] = useState(false);
  const { user, setSession } = useSessionStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<UpdateUserValues>({
    defaultValues: {
      pronoun: user?.pronoun ? user.pronoun : "he",
      gender: user?.gender ? user.gender : "male",
      bio: user?.bio ? user.bio : "",
    },
    resolver: zodResolver(userFormSchema),
  });

  const { mutate: updateProfilePhoto, isPending: isUpdatingProfile } =
    useMutation({
      mutationKey: ["upload-profile"],
      mutationFn: async (file: File) => {
        const res = await uploadFiles([file]);
        if (res.message || !res.data) return toast.error(res.message);
        await updateProfile({ profilePhoto: res.data[0] });
        if (user)
          setSession({ ...user, profilePhoto: res.data[0] as NSCommon.Media });
      },
    });

  const onSubmit = async (values: UpdateUserValues) => {
    const res = await updateProfile(values);
    if (res.message) return toast.error(res.message);
    toast.success("Profile updated successfully");
    if (user) setSession({ ...user, ...res.data });
  };

  useEffect(() => {
    form.reset({
      pronoun: user?.pronoun ? user.pronoun : "he",
      gender: user?.gender ? user.gender : "male",
      bio: user?.bio ? user.bio : "",
    });
  }, [user, form]);

  const isSubmitting = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;

  return (
    <div className="px-4 py-16 space-y-8 max-w-screen-md mx-auto w-full">
      <h1 className="text-lg font-extrabold">Edit Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-muted rounded-xl p-6 flex items-center justify-between">
            <div className="flex gap-x-4">
              <UserAvatar
                className="size-16"
                username={user?.username}
                url={
                  user?.profilePhoto?.url
                    ? user.profilePhoto.url
                    : "/no-user.jpeg"
                }
                onClick={() => setProfileChangeModalOpen(true)}
              />
              <h1 className="text-lg font-bold">{user?.username}</h1>
            </div>

            <Button
              onClick={() => {
                inputRef.current?.click();
              }}
              loading={isSubmitting || isUpdatingProfile}
              type="button"
            >
              Change Photo
            </Button>
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              accept="images/*"
              disabled={isUpdatingProfile}
              onChange={(e) => {
                if (e.target.files?.length) {
                  const file = e.target.files[0];
                  if (!file.type.includes("image"))
                    return toast.error("Please select an image file");
                  if (file.size > 1e6)
                    return toast.error("File size should be less than 1MB");
                  updateProfilePhoto(file);
                }
              }}
            />
          </div>

          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold">Bio</FormLabel>
                <FormControl>
                  <div>
                    <Textarea
                      disabled={isSubmitting}
                      className="resize-none"
                      {...field}
                    />
                    <div className="flex justify-end text-muted-foreground text-sm mt-2">
                      {field.value.length}/150
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pronoun"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold">Pronoun</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger disabled={isSubmitting}>
                      <SelectValue placeholder="Select a pronoun" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="he">He/Him</SelectItem>
                    <SelectItem value="she">She/Her</SelectItem>
                    <SelectItem value="they">They/Them</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold">Pronoun</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger disabled={isSubmitting}>
                      <SelectValue placeholder="Select a pronoun" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={!isDirty} className="ml-auto block">
            Submit
          </Button>
        </form>
      </Form>

      <Dialog
        open={profileChangeModalOpen}
        onOpenChange={setProfileChangeModalOpen}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent
          hideCloseBtn
          className="max-w-[400px] px-8 py-4 flex justify-center flex-col"
        >
          <DialogHeader>
            <DialogTitle>Change Profile Photo</DialogTitle>
          </DialogHeader>
          <Separator />
          <button>Remove current photo</button>
          <button>Remove current photo</button>
          <DialogClose asChild>
            <button>Cancel</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditPage;
