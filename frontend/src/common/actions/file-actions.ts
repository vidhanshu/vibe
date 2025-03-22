"use server";

import { NSAuth } from "@/src/auth/types";
import api from "../utils/axios";
import { NSCommon } from "../types";

export const uploadFiles = async (
  files: File[]
): NSCommon.Response<Omit<NSAuth.Media, "id">[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const res = await api.post("/medias/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error.response?.data?.message ?? error.message,
      data: null,
    };
  }
};

export const deleteFiles = async (keys: string[]): NSCommon.Response<null> => {
  try {
    await api.post("/medias/delete", { keys });
    return { data: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};
