import { cookies } from "next/headers";
import { UserData } from "@/interface";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

// to implement the refresh token, we need to make a POST request to the Spotify API
export async function GET(request: Request) {
  console.log("hi");
  const clientId: string = process.env.CLIENT_ID!;
  const userData = cookies().get("refresh_token")?.value;
  if (userData == null) {
    return Response.json({ message: "No data found" }, { status: 404 });
  }
  const data = userData as string;
  const refreshToken = data;
  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": 'Basic ' + (Buffer.from(clientId + ':' + process.env.CLIENT_SECRET).toString('base64'))
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  };
  const body = await fetch(url, payload);
  const response = await body.json();
  // console.log(response.access_token);
  const res = NextResponse.json({data: response}, {status: 200});
  // const res = Response.json({ message: "Refreshed token" }, { status: 200,
  // headers: {
  //   "Set-Cookie": cookies().getAll().toString(),
  // }});
  return res;
}
