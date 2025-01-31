"use server";

import { NSAuth } from "@/src/auth/types";
import api from "@/src/common/utils/axios";
import { AUTH_API_ROUTES } from "@/src/auth/routes";
import { NSCommon } from "@/src/common/types";
import { NSUser } from "../types";

export const userById = async (id: string): NSCommon.Response<NSUser.User> => {
  try {
    const response = await api.get(AUTH_API_ROUTES.USER_BY_ID(id));
    const resJson = response.data;

    if (response.status !== 200)
      return { message: resJson.message, data: null };

    return { data: resJson };
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const getUserByUsername = async (
  username: string
): NSCommon.Response<NSUser.User> => {
  try {
    const response = await api.get(AUTH_API_ROUTES.USER_BY_USERNAME(username));
    const resJson = response.data;

    if (response.status !== 200)
      return { message: resJson.message, data: null };

    return { data: resJson };
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const getProfile = async (): NSCommon.Response<
  NSUser.User,
  { statusCode?: number }
> => {
  try {
    const response = await api.get(AUTH_API_ROUTES.PROFILE);
    const resJson = response.data;

    if (response.status !== 200)
      return {
        message: resJson.message,
        data: null,
        statusCode: response.status,
      };

    return { data: resJson };
  } catch (error: any) {
    return {
      message: error.message,
      statusCode: error.response.status,
      data: null,
    };
  }
};
