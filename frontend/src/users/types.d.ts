import { NSCommon } from "../common/types";

export namespace NSUser {
  export interface User {
    id: string;
    username: string;
    email: string | null;
    bio: string | null;
    pronoun: "he" | "she" | "they" | null;
    gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
    createdAt: Date;
    updatedAt: Date;
    profilePhoto?: NSCommon.Media;
    _count: {
      followers: number;
      followings: number;
      posts: number;
    };
  }

  export interface UserWithFollows extends User {
    follows: boolean;
  }
}
