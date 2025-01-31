import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "./src/users/actions/user-actions";

const PUBLIC_ROUTES = ["/auth"];
const PRIVATE_ROUTES = ["/"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const purePathname = pathname.split("?")[0];

  try {
    const { data } = await getProfile();
    // if logged in
    if (data) {
      if (PUBLIC_ROUTES.some((route) => purePathname === route)) {
        if (purePathname === "/") {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/", req.url)); // Redirect to home page
      }
      return NextResponse.next();
    } else {
      // Unauthenticated user trying to access a protected route (e.g., /)
      if (PRIVATE_ROUTES.some((route) => purePathname === route)) {
        // Prevent redirect if already on /auth
        if (purePathname === "/auth") {
          return NextResponse.next(); // Allow access to /auth if already on the login page
        }
        return NextResponse.redirect(new URL("/auth", req.url)); // Redirect to login page
      }

      // Allow access to public and unrestricted routes
      return NextResponse.next();
    }
  } catch (error) {
    console.log(error);
    return NextResponse.next();
  }
}
