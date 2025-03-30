export const AUTH_API_ROUTES = {
  SIGNUP: "/auth/register",
  SIGNIN: "/auth/login",
  SIGNOUT: "/auth/logout",
  // TODO: move below two into profile later
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_BY_USERNAME: (id: string) => `/users/username/${id}`,
  PROFILE: "/users/profile",
  CHECK_AUTH: "/auth/check-auth",
};
