"use server";

import { AUTH_API_ROUTES } from "@/src/auth/routes";
import { NSAuth } from "@/src/auth/types";
import { NSCommon } from "@/src/common/types";
import api from "@/src/common/utils/axios";
import { NSUser } from "../types";

export const userById = async (id: string): NSCommon.Response<NSUser.User> => {
  try {
    const response = await api.get(AUTH_API_ROUTES.USER_BY_ID(id));
    const resJson = response.data;

    if (response.status !== 200)
      return { message: resJson.message, data: null };

    return { data: resJson };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const getUserByUsername = async (
  username: string
): NSCommon.Response<NSUser.UserWithFollows> => {
  try {
    const response = await api.get(AUTH_API_ROUTES.USER_BY_USERNAME(username));
    const resJson = response.data;

    if (response.status !== 200)
      return { message: resJson.message, data: null };

    return { data: resJson };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error.message,
      statusCode: error.response.status,
      data: null,
    };
  }
};

export const getUsers = async ({
  limit = 10,
  page = 1,
  search,
}: NSCommon.PaginationDto): NSCommon.Response<
  NSCommon.PaginatedResponse<NSUser.User>
> => {
  try {
    const query = new URLSearchParams();
    query.append("limit", limit.toString());
    query.append("page", page.toString());
    if (search) query.append("search", search);
    const res = await api.get(`/users?${query.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const updateProfile = async ({
  gender,
  bio,
  profilePhoto,
  pronoun,
}: Partial<
  Omit<NSUser.User, "profilePhoto"> & {
    profilePhoto: Omit<NSAuth.Media, "id">;
  }
>): NSCommon.Response<NSUser.User> => {
  try {
    const res = await api.patch(`/users/profile`, {
      gender,
      bio,
      profilePhoto,
      pronoun,
    });
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};
