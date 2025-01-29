"use server";

import { NSAuth } from "@/src/auth/types";
import api from "@/src/common/utils/axios";
import { AUTH_API_ROUTES } from "@/src/auth/routes";

export const userById = async (id: string) => {
  try {
    const response = await api.get(AUTH_API_ROUTES.USER_BY_ID(id));
    const resJson = response.data;

    if (response.status !== 200) return { message: resJson.message };

    return resJson;
  } catch (error: any) {
    return { message: error.message };
  }
};

export const geUserByUsername = async (
  username: string
): Promise<{ user?: NSAuth.User; message?: string }> => {
  try {
    const response = await api.get(AUTH_API_ROUTES.USER_BY_USERNAME(username));
    const resJson = response.data;

    if (response.status !== 200) return { message: resJson.message };

    return { user: resJson };
  } catch (error: any) {
    return { message: error.message };
  }
};

export const getProfile = async (): Promise<{
  user?: NSAuth.User;
  message?: string;
  statusCode?: number;
}> => {
  try {
    const response = await api.get(AUTH_API_ROUTES.PROFILE);
    const resJson = response.data;

    if (response.status !== 200)
      return {
        message: resJson.message,
        statusCode: response.status,
      };

    return { user: resJson } as { user: NSAuth.User };
  } catch (error: any) {
    return { message: error.message, statusCode: error.response.status };
  }
};
