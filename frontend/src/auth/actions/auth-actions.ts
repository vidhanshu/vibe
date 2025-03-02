"use server";

import { AUTH_API_ROUTES } from "../routes";
import {
  clearAuthToken,
  setAuthToken,
} from "@/src/common/utils/get-auth-cookie";
import api from "@/src/common/utils/axios";
import { NSCommon } from "@/src/common/types";

export const signUp = async (
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

    await setAuthToken(accessToken);

    return { data: accessToken, message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const signIn = async (
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

    setAuthToken(accessToken);

    return { data: accessToken };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const signOut = async (): NSCommon.Response<null> => {
  try {
    const res = await api.post(AUTH_API_ROUTES.SIGNOUT);
    await clearAuthToken(); // clear the token no matter what
    if (res.status !== 200) return { message: res.data.message, data: null };
    return { data: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};
