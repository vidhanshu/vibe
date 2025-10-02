import { checkAuth } from "@/src/users/actions/user-actions";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

const AuthLayout = async ({ children }: PropsWithChildren) => {
  const { data } = await checkAuth();

  if (data) return redirect("/");
  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
};

export default AuthLayout;
