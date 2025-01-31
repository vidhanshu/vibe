"use server";

import { NSAuth } from "@/src/auth/types";
import { deleteFiles, uploadFiles } from "@/src/common/actions/file-actions";
import { NSCommon } from "@/src/common/types";
import api from "@/src/common/utils/axios";
import { NSPost } from "./types";

export const createPost = async ({
  title,
  content,
  medias,
}: {
  title: string;
  content: string;
  medias?: File[];
}): NSCommon.Response<{ post: NSPost.Post }> => {
  let uploadedFiles: Omit<NSAuth.Media, "id">[] = [];
  try {
    if (medias?.length) {
      const res = await uploadFiles(medias);
      if (res.message) {
        return { message: res.message, data: null };
      }
      uploadedFiles = res.data ?? [];
    }
    const newPayload: any = { title, content };
    if (uploadedFiles.length) {
      newPayload.medias = uploadedFiles;
    }
    const res = await api.post("/posts", newPayload);
    if (res.status !== 201) {
      // delete uploaded files, if error
      if (uploadedFiles.length)
        await deleteFiles(uploadedFiles.map(({ key }) => key));
      return { message: res.data.message, data: null };
    }

    return { data: res.data };
  } catch (error: any) {
    // delete uploaded files, if error
    if (uploadedFiles.length)
      await deleteFiles(uploadedFiles.map(({ key }) => key));
    return { message: error.message, data: null };
  }
};

export const getPosts = async ({
  username,
}: {
  username: string;
}): NSCommon.Response<NSCommon.PaginatedResponse<NSPost.Post>> => {
  try {
    const res = await api.get(`/posts?username=${username}`);
    return { data: res.data };
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};
