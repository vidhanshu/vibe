import { cookies } from "next/headers";
import "server-only";

export const getAuthToken = async () => {
  const cok = await cookies();
  return cok.get("authToken")?.value;
};

export const setAuthToken = async (accessToken: string) => {
  const cok = await cookies();
  cok.set("authToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};

export const clearAuthToken = async () => {
  const cok = await cookies();
  cok.set("authToken", "", {
    maxAge: -1,
    path: "/", // Ensure it clears across the entire domain
  });
};
