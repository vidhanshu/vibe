"use server";

import { NSCommon } from "@/src/common/types";
import api from "@/src/common/utils/axios";
import { NSUser } from "../types";

export const getFollowers = async ({
  limit = 10,
  page = 1,
  search,
  id,
}: NSCommon.PaginationDto & { id: string }): NSCommon.Response<
  NSCommon.PaginatedResponse<NSUser.User>
> => {
  try {
    const query = new URLSearchParams();
    query.append("limit", limit.toString());
    query.append("page", page.toString());
    if (search) query.append("search", search);
    const res = await api.get(`/users/${id}/followers?${query.toString()}`);
    return { data: res.data };
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};

export const followUnfollow = async (userId: string) => {
  try {
    const res = await api.post(`/users/${userId}/follows`);
    return { data: res.data };
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};
