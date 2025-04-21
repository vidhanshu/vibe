import { NSCommon } from "../common/types";
import api from "../common/utils/axios";
import { USERS_API_ROUTES } from "./api-routes";
import { NSUser } from "./types";

const userById = async (id: string): NSCommon.Response<NSUser.User> => {
  try {
    const response = await api.get(USERS_API_ROUTES.USER_BY_ID(id));
    const resJson = response.data;

    if (response.status !== 200)
      return { message: resJson.message, data: null };

    return { data: resJson };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

const getUserByUsername = async (
  username: string
): NSCommon.Response<NSUser.DetailedUser> => {
  try {
    const response = await api.get(USERS_API_ROUTES.USER_BY_USERNAME(username));
    const resJson = response.data;

    if (response.status !== 200)
      return { message: resJson.message, data: null };

    return { data: resJson };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

const getProfile = async (): NSCommon.Response<
  NSUser.User,
  { statusCode?: number }
> => {
  try {
    const response = await api.get(USERS_API_ROUTES.PROFILE);
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
      message: error?.response?.data?.message || error.message,
      statusCode: error.response.status,
      data: null,
    };
  }
};

const getUsers = async ({
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
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

const getFollowSuggestions = async ({
  page = 1,
  search,
}: NSCommon.PaginationDto): NSCommon.Response<
  NSCommon.PaginatedResponse<
    NSUser.User & {
      followers: { follower: { username: string } }[];
    }
  >
> => {
  try {
    const query = new URLSearchParams();
    query.append("page", page.toString());
    if (search) query.append("search", search);
    const res = await api.get(`/users/suggested-to-follow?${query.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

const updateProfile = async ({
  gender,
  bio,
  profilePhoto,
  pronoun,
  name,
}: Partial<
  Omit<NSUser.User, "profilePhoto"> & {
    profilePhoto: Omit<NSCommon.Media, "id">;
  }
>): NSCommon.Response<NSUser.User> => {
  try {
    const res = await api.patch(`/users/profile`, {
      gender,
      bio,
      profilePhoto,
      pronoun,
      name,
    });
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const usersService = {
  getProfile,
  getFollowSuggestions,
  getUserByUsername,
  userById,
  updateProfile,
  getUsers,
};
