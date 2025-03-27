import { NSPost } from "../posts/types";
import { NSUser } from "../users/types";

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

  export interface Notification {
    id: string;
    byUserId: string;
    byUser: NSUser.User & {follows?:boolean};
    forUserId: string;
    forUser: NSUser.User;
    type: NotificationType;
    postId?: string;
    post?: NSPost.Post;
    statusId?: string;
    status: NSPost.Status;
    commentId?: string;
    comment: NSPost.Comment;
    createdAt: Date;
    updatedAt: Date;
  }

  export type NotificationType = "FOLLOW" | "LIKE" | "COMMENT" | "MENTION";

  export type MediaType = "IMAGE" | "VIDEO";

  export type Response<T, K = object> = Promise<
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
