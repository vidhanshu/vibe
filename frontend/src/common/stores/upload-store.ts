import { create } from "zustand";

interface UploadState {
  uploads: { id: string; status: "uploading" | "completed" | "failed" }[];
  addUpload: (id: string) => void;
  updateUpload: (id: string, status: "completed" | "failed") => void;
  removeUpload: (id: string) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploads: [],
  addUpload: (id) =>
    set((state) => ({
      uploads: [...state.uploads, { id, status: "uploading" }],
    })),
  updateUpload: (id, status) => {
    set((state) => ({
      uploads: state.uploads.map((upload) =>
        upload.id === id ? { ...upload, status } : upload
      ),
    }));
    if (status === "failed" || status === "completed") {
      setTimeout(() => {
        console.log("removed the upload");
        set((state) => ({
          uploads: state.uploads.filter((upload) => upload.id !== id),
        }));
      }, 5000);
    }
  },
  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((upload) => upload.id !== id),
    })),
}));
