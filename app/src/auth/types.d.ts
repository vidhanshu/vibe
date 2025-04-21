// The interfaces are copied from prisma-client in backend

export namespace NSAuth {
  export interface User {
    id: string;
    username: string;
    email: string | null;
    bio: string | null;
    pronoun: string | null;
    gender: string | null;
    createdAt: Date;
    updatedAt: Date;
    profilePhoto?: Media;
    _count: {
      followers: number;
      followings: number;
      posts: number;
    };
  }
  // TODO: move this to appropriate folder later
  export interface Media {
    id: string;
    url: string;
    key: string;
    mediaType?: MediaType;
  }
  export type MediaType = "IMAGE" | "VIDEO";
}
