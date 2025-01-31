export namespace NSUser {
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
}
