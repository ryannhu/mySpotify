"use server";

import { cookies, headers } from "next/headers";
import { UserData, TrackData, TopTrackData } from "@/interface";
import Header from "../components/header";
import TrackList from "./tracklist";



async function getData(
  timeRange: string = "short_term",
): Promise<TopTrackData> {
  const userData = cookies().get("data")?.value;
  if (userData == null) {
    throw new Error("cookie is null");
  }
  const data: UserData = JSON.parse(userData) as UserData;
  const accessToken = data.access_token;
  let params = {
    limit: "49",
    offset: "0",
    time_range: timeRange,
  };
  let queryString = new URLSearchParams(params).toString();
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

  params = {
    limit: "50",
    offset: "49",
    time_range: timeRange,
  };

  queryString = new URLSearchParams(params).toString();

  // make second call for items 50-99
  const res2 = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?${queryString}&offset=49`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  // combine the two responses items
  const data1 = await res.json();
  const data2 = await res2.json();
  data1.items = data1.items.concat(data2.items);
  return data1 as TopTrackData;
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  console.log(searchParams);
  const timeRange: string = searchParams.timeRange || "short_term";
  const data: TopTrackData = (await getData(timeRange)) as TopTrackData;

  return (
    <div className="bg-gray-900">
      <div className="pt-10 justify-center flex flex-row">
        <h1 className="justify-center content-center text-white text-4xl basis-1/2">
          Top Tracks
        </h1>
        <div className="flex basis-1/4 flex-row justify-between px-2 text-white">
          <a href="tracks/?timeRange=short_term">Last 4 Weeks</a>
          <a href="tracks/?timeRange=medium_term">Last 6 Months</a>
          <a href="tracks/?timeRange=long_term">All Time</a>
        </div>
      </div>
      <TrackList tracks={data.items} />
      <Header />
    </div>
  );
}
