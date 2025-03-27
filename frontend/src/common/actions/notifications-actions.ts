"use server";

import { NSCommon } from "../types";
import api from "../utils/axios";

export const getNotifications = async ({
  page,
}: {
  page?: number;
}): NSCommon.Response<NSCommon.PaginatedResponse<NSCommon.Notification>> => {
  try {
    const sp = new URLSearchParams();
    if (page) sp.append("page", page.toString());
    const res = await api.get(`/notifications?${sp.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};
