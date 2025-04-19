import { NSCommon } from "../common/types";
import api from "../common/utils/axios";
import { USERS_API_ROUTES } from "./api-routes";
import { NSUser } from "./types";

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

export const usersService = { getProfile };
