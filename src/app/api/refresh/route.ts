import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { UserData } from "@/interface";

// to implement the refresh token, we need to make a POST request to the Spotify API
export async function GET(request: Request) {
  console.log("hi");
  const clientId: string = process.env.CLIENT_ID!;

  const userData = cookies().get("data")?.value;
  if (userData == null) {
    throw new Error("cookie is null");
  }
  const data: UserData = JSON.parse(userData) as UserData;

  const refreshToken = data.refresh_token;
  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.CLIENT_ID!,
    }),
  };
  const body = await fetch(url, payload);
  const response = await body.json();
  cookies().set("data", JSON.stringify(response), {
    httpOnly: true,
  });

  console.log("hi");
  return Response.json({ message: "Refreshed token" }, { status: 200 });
}
