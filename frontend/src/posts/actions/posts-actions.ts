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
  // TODO:  Please add post type
}): Promise<{ message?: string; post?: any }> => {
  let uploadedFiles: Omit<NSAuth.Media, "id">[] = [];
  try {
    if (medias?.length) {
      const res = await uploadFiles(medias);
      if (res.message) {
        console.log("[upload failed]", res.message);
        return { message: res.message };
      }
      uploadedFiles = res.files ?? [];
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
      console.log("[post creation failed]", res.data.message);
      return { message: res.data.message };
    }

    return { post: res.data };
  } catch (error: any) {
    console.log("[post creation failed]", error.message);
    // delete uploaded files, if error
    if (uploadedFiles.length)
      await deleteFiles(uploadedFiles.map(({ key }) => key));
    return { message: error.message };
  }
};

export const getPosts = async ({
  username,
}: {
  username: string;
  // TODO: make all server actions follow this patter of response
}): NSCommon.Response<NSCommon.PaginatedResponse<NSPost.Post>> => {
  try {
    const res = await api.get(`/posts?username=${username}`);
    return { data: res.data };
  } catch (error: any) {
    return { message: error.message, data: null };
  }
};
