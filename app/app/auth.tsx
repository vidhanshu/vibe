import { Box } from "@/components/ui/box";
import React, { useState } from "react";
import { Image } from "react-native";
import SignInForm from "@/src/auth/components/sign-in-form";
import SignUpForm from "@/src/auth/components/sign-up-form";

export default function Auth() {
  const [signIn, setSignIn] = useState(true);

  return (
    <Box className="flex-1 flex flex-col items-center justify-between px-6">
      <Box className="flex-1 flex items-center justify-center">
        <Image
          resizeMode="contain"
          className="w-[93px] h-[120px] mx-auto"
          source={require("/assets/images/full-logo-vertical.png")}
        />
      </Box>
      {signIn ? (
        <SignInForm toggleAuthType={() => setSignIn((p) => !p)} />
      ) : (
        <SignUpForm toggleAuthType={() => setSignIn((p) => !p)} />
      )}
    </Box>
  );
}
