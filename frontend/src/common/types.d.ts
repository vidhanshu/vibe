export namespace NSCommon {
  export interface FullMedia {
    id: string;
    url: string;
    key: string;
    mediaType: "IMAGE" | "VIDEO";
    postId: string | null;
    userId: string | null;
    statusId: string | null;
    messageId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  export interface Media {
    id: string;
    url: string;
    key: string;
    mediaType: "IMAGE" | "VIDEO";
  }

  export type Response<T> = Promise<{
    message?: string;
    data: T | null;
  }>;

  export interface PaginatedResponse<T> {
    items: T[];
    metadata: {
      currentPage: number;
      totalItems: number;
      itemsCount: number;
      totalPages: number;
      limit: number;
    };
  }
}
