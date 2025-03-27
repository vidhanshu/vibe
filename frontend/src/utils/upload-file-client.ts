"use client";

import axios from "axios";
import { getAuthTokenSA } from "../common/actions/get-token";
import { toast } from "sonner";
import { NSCommon } from "../common/types";
import { API_BASE_URL } from "../common/utils/constants";

const uploadFileClient = async (
  files: File[],
  onProgress?: (progress: number) => void
) => {
  let uploadedFiles: NSCommon.Media[] = [];
  let uploadedKeys = [];
  const token = await getAuthTokenSA();
  if (!token) {
    toast.error("Something went wrong, please try again!");
    return false;
  }

  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await axios.post(`${API_BASE_URL}/medias/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.(progress);
      },
    });

    if (res.data) {
      uploadedFiles = res.data as NSCommon.Media[];
      uploadedKeys.push(res.data.key); // Assuming response contains a "key"
    }
    return uploadedFiles;
  } catch (error) {
    // If any upload fails, delete previously uploaded files
    if (uploadedKeys.length > 0) {
      await axios.post(
        `${API_BASE_URL}/medias/delete`,
        { keys: uploadedKeys },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    console.log(error);
    toast.error("Failed uploading");
    return false;
  }
};

export default uploadFileClient;
