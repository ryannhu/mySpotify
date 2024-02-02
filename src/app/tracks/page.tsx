import { cookies, headers } from "next/headers";
import { UserData, TrackData } from "@/interface";
import Header from "../components/header";
import TrackList from "./tracklist";

interface TopTrackData {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: TrackData[];
}

async function getData(): Promise<TopTrackData> {
  const userData = cookies().get("data")?.value;
  if (userData == null) {
    throw new Error("cookie is null");
  }
  const data: UserData = JSON.parse(userData) as UserData;
  const accessToken = data.access_token;
  const params = {
    limit: "50",
    offset: "0",
    time_range: "short_term",
  };
  const queryString = new URLSearchParams(params).toString();
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (res.status === 401) {
    // use redirect, maybe should make function
    console.log("hello 401");
    const response = await fetch(process.env.CURRENT_URL + "/api/refresh", {
      method: "GET",
    });
    const data = await response.json();
  }

  if (!res.ok) {
    console.log(res.status);
    throw new Error("Failed to fetch API");
  }

  return res.json();
}

export default async function Page() {
  const data: TopTrackData = (await getData()) as TopTrackData;
  console.log(data.items);

  return (
    <div className="bg-gray-900">
      <div className="pt-10 justify-center">
        <h1 className="justify-center content-center text-white text-4xl">
          Top Tracks
        </h1>
      </div>
      <TrackList tracks={data.items} />
      <Header />
    </div>
  );
}
