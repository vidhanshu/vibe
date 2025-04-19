import React from "react";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../auth.service";
import { router } from "expo-router";
import useAppToast from "@/src/common/hooks/use-app-toast";

export type SignInValueState = { username: string; password: string };
export default function SignInForm({
  toggleAuthType,
}: {
  toggleAuthType: () => void;
}) {
  const qc = useQueryClient();
  const toast = useAppToast({});
  const [value, setValue] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (values: SignInValueState) => {
      const res = await authService.signIn(
        values.username,
        values.password.trim()
      );
      if (res.message) return toast.error(res.message);
      qc.invalidateQueries({ queryKey: ["session"] });
      toast.success("Signed in");
      return res.data;
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (value.username.trim().length < 6)
      newErrors.username = "Minimum 6 characters";
    if (value.password.trim().length < 6)
      newErrors.password = "Minimum 6 characters";

    setErrors(newErrors as SignInValueState);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    mutate(value);
  };

  return (
    <>
      <Box className="flex-1 w-full flex justify-center">
        <FormControl>
          <VStack space="lg">
            <Box>
              <Input
                size="2xl"
                isRequired
                isDisabled={isPending}
                isInvalid={!!errors.username}
                className="my-1"
              >
                <InputField
                  type="text"
                  className="!text-lg"
                  placeholder="Enter username"
                  value={value.username}
                  onChangeText={(text) =>
                    setValue((v) => ({
                      ...v,
                      username: text.trim(),
                    }))
                  }
                />
              </Input>
              {errors.username && (
                <FormControlErrorText>{errors.username}</FormControlErrorText>
              )}
            </Box>
            <Box>
              <Input
                size="2xl"
                isRequired
                className="my-1"
                isDisabled={isPending}
                isInvalid={!!errors.password}
              >
                <InputField
                  type="password"
                  className="!text-lg"
                  placeholder="Enter password"
                  value={value.password}
                  onChangeText={(text) =>
                    setValue((v) => ({ ...v, password: text }))
                  }
                />
              </Input>
              {errors.password && (
                <FormControlErrorText>{errors.password}</FormControlErrorText>
              )}
            </Box>
            <Text className="text-primary-500 text-right">
              Forget password?
            </Text>
          </VStack>
        </FormControl>
      </Box>
      <Box className="flex-1 w-full flex justify-center gap-4">
        <Button
          size="2xl"
          isDisabled={isPending}
          className="mt-4"
          onPress={handleSubmit}
        >
          <ButtonText>Log in</ButtonText>
          {isPending && <ButtonSpinner color="white" />}
          <Entypo size={14} name="login" color="white" />
        </Button>
        <Text size="lg" className="text-center">
          Don&apos;t have an account?{" "}
          <Text
            disabled={isPending}
            className="text-primary-500 disabled:text-secondary-500"
            onPress={toggleAuthType}
          >
            Sign up
          </Text>
        </Text>
      </Box>
    </>
  );
}
