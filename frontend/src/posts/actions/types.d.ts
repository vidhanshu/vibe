import { NSCommon } from "@/src/common/types";
import { NSUser } from "@/src/users/types";

export namespace NSPost {
  export interface Post {
    id: string;
    title: string;
    content: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    medias: NSCommon.FullMedia[];
    _count: {
      likes: 0;
      comments: 0;
    };
  }

  export interface DetailedPost {
    id: string;
    title: string;
    content: string;
    userId: string;
    user: NSUser.User;
    createdAt: Date;
    updatedAt: Date;
    medias: NSCommon.FullMedia[];
    _count: {
      likes: 0;
      comments: 0;
    };
    likes: { userId: string }[];
  }

  export interface Like {
    id: string;
    postId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Comment {
    id: string;
    user: NSUser.User;
    content: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
