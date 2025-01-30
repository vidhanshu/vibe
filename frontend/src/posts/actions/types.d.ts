import { NSCommon } from "@/src/common/types";

export namespace NSPost {
  export interface Post {
    id: string;
    title: string;
    content: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    medias: NSCommon.FullMedia;
    _count: {
      likes: 0;
      comments: 0;
    };
  }
}
