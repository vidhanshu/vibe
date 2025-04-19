import { NSCommon } from "../common/types";
import { NSPost } from "../posts/types";

export namespace NSUser {
  export interface User {
    id: string;
    username: string;
    name?: string;
    email: string | null;
    bio: string | null;
    pronoun: "he" | "she" | "they" | null;
    gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
    createdAt: Date;
    updatedAt: Date;
    profilePhoto?: NSCommon.Media;
    status?: NSPost.Status;
    _count: {
      followers: number;
      followings: number;
      posts: number;
    };
  }

  export interface DetailedUser extends User {
    follows: boolean;
    // has max 2 followers, just to show who follows
    followers?: {
      follower: {
        username: string;
      };
    }[];
  }

  export interface UserWithFollows extends User {
    follows: boolean;
  }
}
