import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies, headers } from "next/headers";
import {
  ResponseCookies,
  RequestCookies,
} from "next/dist/compiled/@edge-runtime/cookies";

export async function middleware(request: NextRequest) {
  const cookie = cookies().get("data");
  const { pathname, origin } = request.nextUrl;

  // if the user is not logged in, redirect to the login page
  if (cookie == null || cookie == undefined) {
    return NextResponse.redirect(`${origin}`);
  }
  if (cookie.value == "") {
    return NextResponse.redirect(`${origin}`);
  }

  // check if user's access token is expired
  // make call to spotify api to ping the user's access token
  const userData = JSON.parse(cookie.value);
  const accessToken = userData.access_token;
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const nextResponse = NextResponse.next();
  // if the access token is expired, refresh the token
  if (response.status === 401) {
    const refreshToken = await fetch("http://localhost:3000/api/refresh", {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    });

    const data = (await refreshToken.json()).data;

    nextResponse.cookies.set("data", JSON.stringify(data), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    applySetCookie(request, nextResponse);
  } else if (!response.ok) {
    return NextResponse.redirect(`${origin}`);
  }

  return nextResponse;
}

function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
};
