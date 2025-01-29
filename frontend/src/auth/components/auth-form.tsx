"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { signUp, signIn as Login } from "@/src/auth/actions/auth-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const authFormSchema = z.object({
  username: z.string().min(3).max(20),
  // email: z.optional(z.string()),
  password: z.string().min(8),
});

function AuthForm() {
  const router = useRouter();
  const [signIn, setSignIn] = useState(true);

  const form = useForm<z.infer<typeof authFormSchema>>({
    defaultValues: { username: "", password: "" },
    resolver: zodResolver(authFormSchema),
  });

  const onSubmit = async ({
    username,
    password,
  }: z.infer<typeof authFormSchema>) => {
    if (signIn) {
      const { message } = await Login(username, password);
      if (message) return toast.error(message);
      else toast.success("Logged in successfully");
    } else {
      const { message } = await signUp(username, password);
      if (message) return toast.error(message);
      else toast.success("Signed up successfully");
    }
    router.replace("/");
  };

  const { isSubmitting } = form.formState;

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <Image
          src="/full-logo.svg"
          width={120}
          height={60}
          className="mx-auto h-auto w-[150px]"
          alt="vibe logo"
          priority
        />
        <CardTitle className="text-2xl">
          {signIn ? "Login" : "Sign Up"}
        </CardTitle>
        <CardDescription>
          {signIn
            ? "Enter your username and password to login"
            : "Enter your details below to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* {!signIn && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-xs">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        required={false}
                        type="email"
                        placeholder="eg. vidhashu@vibe.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      autoFocus
                      placeholder="eg. vibe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button loading={isSubmitting} type="submit" className="w-full">
                {signIn ? "Login" : "Sign Up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {signIn ? "Don't have an account?" : "Already have an account?"}
              <span
                onClick={() => {
                  if (isSubmitting) return;

                  form.reset();
                  setSignIn((e) => !e);
                }}
                className="ml-2 text-primary cursor-pointer underline underline-offset-4"
              >
                Sign {signIn ? "up" : "in"}
              </span>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AuthForm;
