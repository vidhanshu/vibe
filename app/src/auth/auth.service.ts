import api from "@/src/common/utils/axios";
import { NSCommon } from "@/src/common/types";
import * as SecureStore from "expo-secure-store";
import { AUTH_API_ROUTES } from "./api-routes";

const signUp = async (
  username: string,
  password: string
): NSCommon.Response<string> => {
  try {
    const response = await api.post(AUTH_API_ROUTES.SIGNUP, {
      username,
      password,
    });

    const { accessToken, message, error } = response.data;

    if (error) return { message, data: null };

    await SecureStore.setItemAsync("token", accessToken);

    return { data: accessToken, message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

const signIn = async (
  username: string,
  password: string
): NSCommon.Response<string> => {
  try {
    const response = await api.post(AUTH_API_ROUTES.SIGNIN, {
      username,
      password,
    });

    const { accessToken, message, error } = response.data;

    if (error) return { message, data: null };

    await SecureStore.setItemAsync("token", accessToken);

    return { data: accessToken };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

const signOut = async (): NSCommon.Response<null> => {
  try {
    const res = await api.post(AUTH_API_ROUTES.SIGNOUT);
    await SecureStore.deleteItemAsync("token"); // clear the token no matter what
    if (res.status !== 200) return { message: res.data.message, data: null };
    return { data: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const authService = { signUp, signIn, signOut };
