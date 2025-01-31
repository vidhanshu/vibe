export namespace NSCommon {
  export interface FullMedia {
    id: string;
    url: string;
    key: string;
    mediaType: MediaType;
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
    mediaType: MediaType;
  }

  export type MediaType = "IMAGE" | "VIDEO";

  export type Response<T, K = {}> = Promise<
    {
      message?: string;
      data: T | null;
    } & K
  >;

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

  export interface PaginationDto {
    limit?: number;
    page?: number;
    search?: string;
  }
}
