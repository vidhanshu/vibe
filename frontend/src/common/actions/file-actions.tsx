"use server";

import { NSAuth } from "@/src/auth/types";
import api from "../utils/axios";

export const uploadFiles = async (
  files: File[]
): Promise<{ files?: Omit<NSAuth.Media, "id">[]; message?: string }> => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const res = await api.post("/medias/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { files: res.data };
  } catch (error: any) {
    return { message: error.response?.data?.message ?? error.message };
  }
};

export const deleteFiles = async (keys: string[]) => {
  try {
    await api.post("/medias/delete", { keys });
  } catch (error: any) {
    return { error: error.message };
  }
};
