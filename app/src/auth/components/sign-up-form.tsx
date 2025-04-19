import React from "react";
import { useState } from "react";
import { SignInValueState } from "./sign-in-form";
import { Box } from "@/components/ui/box";
import {
  FormControl,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Entypo } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../auth.service";
import useAppToast from "@/src/common/hooks/use-app-toast";

type SignUpValueState = SignInValueState & { confirmPassword: string };
export default function SignUpForm({
  toggleAuthType,
}: {
  toggleAuthType: () => void;
}) {
  const qc = useQueryClient();
  const appToast = useAppToast({});
  const [value, setValue] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (values: SignInValueState) => {
      const res = await authService.signUp(
        values.username,
        values.password.trim()
      );
      if (res.message) return appToast.error(res.message);
      qc.invalidateQueries({ queryKey: ["session"] });
      appToast.success("Signed up successfully!");
      return res.data;
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (value.username.length < 6) newErrors.username = "Minimum 6 characters";
    if (value.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (value.confirmPassword.length < 6)
      newErrors.confirmPassword = "Minimum 6 characters";
    if (value.confirmPassword !== value.password)
      newErrors.confirmPassword = "Confirm password & password should match";

    setErrors(newErrors as SignUpValueState);

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
                      username: text.toLowerCase().trim(),
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
            <Box>
              <Input
                size="2xl"
                isRequired
                className="my-1"
                isDisabled={isPending}
                isInvalid={!!errors.confirmPassword}
              >
                <InputField
                  type="password"
                  className="!text-lg"
                  placeholder="Enter confirm password"
                  value={value.confirmPassword}
                  onChangeText={(text) =>
                    setValue((v) => ({ ...v, confirmPassword: text }))
                  }
                />
              </Input>
              {errors.confirmPassword && (
                <FormControlErrorText>
                  {errors.confirmPassword}
                </FormControlErrorText>
              )}
            </Box>
          </VStack>
        </FormControl>
      </Box>
      <Box className="flex-1 w-full flex justify-center gap-4">
        <Button size="2xl" className="mt-4" onPress={handleSubmit}>
          <ButtonText>Sign up</ButtonText>
          {isPending && <ButtonSpinner color="white" />}
          <Entypo size={14} name="rocket" color="white" />
        </Button>
        <Text size="lg" className="text-center">
          Already have an account?{" "}
          <Text
            disabled={isPending}
            className="text-primary-500 disabled:text-secondary-500"
            onPress={toggleAuthType}
          >
            Sign in
          </Text>
        </Text>
      </Box>
    </>
  );
}
