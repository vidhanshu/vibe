"use server";

import { AUTH_API_ROUTES } from "../routes";
import {
  clearAuthToken,
  setAuthToken,
} from "@/src/common/utils/get-auth-cookie";
import api from "@/src/common/utils/axios";
import { NSAuth } from "../types";

export const signUp = async (username: string, password: string) => {
  try {
    const response = await api.post(AUTH_API_ROUTES.SIGNUP, {
      username,
      password,
    });

    const { accessToken, message, error } = response.data;

    if (error) return { message };

    await setAuthToken(accessToken);

    return { accessToken };
  } catch (error: any) {
    return { message: error.message };
  }
};

export const signIn = async (username: string, password: string) => {
  try {
    const response = await api.post(AUTH_API_ROUTES.SIGNIN, {
      username,
      password,
    });

    const { accessToken, message, error } = response.data;

    if (error) return { message };

    setAuthToken(accessToken);

    return { accessToken };
  } catch (error: any) {
    console.log(error);
    return { message: error.message };
  }
};

export const signOut = async () => {
  try {
    const res = await api.post(AUTH_API_ROUTES.SIGNOUT);
    await clearAuthToken(); // clear the token no matter what
    if (res.status !== 200) return { message: res.data.message };
  } catch (error: any) {
    return { message: error.message };
  }
};
