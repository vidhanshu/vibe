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

  export interface DetailedPost extends Post {
    user: NSUser.User;
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

  export interface Status {
    id: string;
    message: null | string;
    backgroundColor: string;
    userId: string;
    statusType: "MEDIA" | "TEXT";
    createdAt: Date;
    updatedAt: Date;
    user: Pick<NSUser.User, "id" | "username" | "profilePhoto">;
    medias: NSCommon.Media[];
    _count: {
      views: 0;
    };
    viewed: boolean;
  }
}
