"use server";

import { NSAuth } from "@/src/auth/types";
import { deleteFiles, uploadFiles } from "@/src/common/actions/file-actions";
import { NSCommon } from "@/src/common/types";
import api from "@/src/common/utils/axios";
import { NSPost } from "@/src/posts/types";

export const getStatuses = async ({
  page,
}: {
  page?: number;
}): NSCommon.Response<NSCommon.PaginatedResponse<NSPost.Status>> => {
  try {
    const sp = new URLSearchParams();
    if (page) sp.append("page", page.toString());
    const res = await api.get(`/statuses?${sp.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const createStatus = async ({
  backgroundColor,
  message,
  uploadedFiles,
}: {
  backgroundColor: string;
  message: string;
  uploadedFiles?: NSCommon.Media[];
}): NSCommon.Response<{ post: NSPost.Post }> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newPayload: any = { message, backgroundColor };
    if (uploadedFiles?.length) {
      newPayload.medias = uploadedFiles;
    }
    const res = await api.post("/statuses", newPayload);
    if (res.status !== 201) {
      // delete uploaded files, if error
      if (uploadedFiles?.length) {
        console.log("[createStatus:try:deletingFiles]");
        await deleteFiles(uploadedFiles.map(({ key }) => key));
      }
      return { message: res.data.message, data: null };
    }

    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // delete uploaded files, if error
    if (uploadedFiles?.length) {
      console.log("[createStatus:catch:deletingFiles]");
      await deleteFiles(uploadedFiles.map(({ key }) => key));
    }
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const addStatusView = async (
  statusId: string
): NSCommon.Response<null> => {
  try {
    const response = await api.post(`/statuses/${statusId}/add-view`);
    if (response.status !== 200)
      return { message: response.data.message, data: null };
    return { data: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const deleteStatus = async (): NSCommon.Response<null> => {
  try {
    const response = await api.delete("/statuses");
    if (response.status !== 200)
      return { message: response.data.message, data: null };
    return { data: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};
