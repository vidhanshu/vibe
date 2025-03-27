"use server";

import { NSAuth } from "@/src/auth/types";
import { deleteFiles, uploadFiles } from "@/src/common/actions/file-actions";
import { NSCommon } from "@/src/common/types";
import api from "@/src/common/utils/axios";
import { NSPost } from "../types";

export const createPost = async ({
  title,
  content,
  uploadedFiles = [],
  hashTags = [],
}: {
  title: string;
  content: string;
  uploadedFiles?: NSCommon.Media[];
  hashTags?: string[];
}): NSCommon.Response<{ post: NSPost.Post }> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newPayload: any = { title, content };
    if (uploadedFiles.length) {
      newPayload.medias = uploadedFiles;
    }
    if (hashTags.length) {
      newPayload.hashTags = hashTags;
    }
    const res = await api.post("/posts", newPayload);
    if (res.status !== 201) {
      // delete uploaded files, if error
      if (uploadedFiles.length)
        await deleteFiles(uploadedFiles.map(({ key }) => key));
      return { message: res.data.message, data: null };
    }

    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // delete uploaded files, if error
    if (uploadedFiles.length)
      await deleteFiles(uploadedFiles.map(({ key }) => key));
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const deletePost = async (postId: string): NSCommon.Response<null> => {
  try {
    const response = await api.delete(`/posts/${postId}`);
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

export const updatePost = async (
  postId: string,
  title: string,
  content: string
): NSCommon.Response<NSPost.Comment> => {
  try {
    const response = await api.patch(`/posts/${postId}`, {
      title,
      content,
    });
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

export const getPosts = async ({
  tag,
  username,
  page,
}: {
  tag?: string;
  username?: string;
  page?: number;
}): NSCommon.Response<NSCommon.PaginatedResponse<NSPost.Post>> => {
  try {
    const sp = new URLSearchParams();
    if (page) sp.append("page", page.toString());
    if (username) sp.append("username", username);
    if (tag) sp.append("tag", tag);
    const res = await api.get(`/posts?${sp.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};
export const getExplorePosts = async ({
  page,
}: {
  page?: number;
}): NSCommon.Response<NSCommon.PaginatedResponse<NSPost.Post>> => {
  try {
    const sp = new URLSearchParams();
    if (page) sp.append("page", page.toString());
    const res = await api.get(`/posts/explore?${sp.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const getSavedPosts = async ({
  page,
}: {
  page?: number;
}): NSCommon.Response<NSCommon.PaginatedResponse<NSPost.Post>> => {
  try {
    const sp = new URLSearchParams();
    if (page) sp.append("page", page.toString());
    const res = await api.get(`/posts/saved?${sp.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const getPostById = async (
  id: string
): NSCommon.Response<NSPost.DetailedPost> => {
  try {
    const response = await api.get(`/posts/${id}`);
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

//
export const likeUnLike = async (
  postId: string
): NSCommon.Response<NSPost.Like> => {
  try {
    const response = await api.patch(`/posts/${postId}/like-unlike`);
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

export const saveUnsave = async (
  postId: string
): NSCommon.Response<{ statusCode: number; message: string }> => {
  try {
    const response = await api.patch(`/posts/${postId}/save-unsave`);
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

//
export const getComments = async (
  postId: string,
  { page = 1 }: NSCommon.PaginationDto
): NSCommon.Response<NSCommon.PaginatedResponse<NSPost.Comment>> => {
  try {
    const query = new URLSearchParams();
    query.append("page", page.toString());
    const res = await api.get(`/posts/${postId}/comments?${query.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};

export const addComment = async (
  postId: string,
  content: string
): NSCommon.Response<NSPost.Comment> => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    const resJson = response.data;

    if (response.status !== 201)
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

export const deleteComment = async (
  postId: string,
  commentId: string
): NSCommon.Response<null> => {
  try {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
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

export const updateComment = async (
  postId: string,
  commentId: string,
  content: string
): NSCommon.Response<NSPost.Comment> => {
  try {
    const response = await api.patch(`/posts/${postId}/comments/${commentId}`, {
      content,
    });
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

export const getHashTags = async ({
  name,
}: {
  name: string;
}): NSCommon.Response<NSPost.HashTag[]> => {
  try {
    const sp = new URLSearchParams();
    if (name) sp.append("q", name);
    const res = await api.get(`/posts/hashtags/suggest?${sp.toString()}`);
    return { data: res.data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.message,
      data: null,
    };
  }
};
