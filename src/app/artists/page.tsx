import { cookies } from "next/headers";
import { UserData, ArtistObject } from "@/interface";
import Header from "../components/header";
import ArtistPortrait from "./artistportrait";

interface TopArtistData {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: ArtistObject[];
}

async function getData(): Promise<TopArtistData> {
  const userData = cookies().get("data")?.value;
  if (userData == null) {
    throw new Error("cookie is null");
  }
  const data: UserData = JSON.parse(userData) as UserData;
  const accessToken = data.access_token;

  let params = {
    limit: "49",
    offset: "0",
    time_range: "short_term",
  };
  const queryString = new URLSearchParams(params).toString();
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );


  if (!res.ok) {
    throw new Error("Failed to fetch API");
  }

  
  params = {
    limit: "50",
    offset: "49",
    time_range: "short_term",
  };

  const queryString2 = new URLSearchParams(params).toString();
  const res2 = await fetch(
    `https://api.spotify.com/v1/me/top/artists?${queryString2}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data1 = await res.json();
  const data2 = await res2.json();
  data1.items = data1.items.concat(data2.items);
  return data1 as TopArtistData;
    console.log(data1.items.length)
  return res.json();
}

export default async function Page() {
  let artistData: ArtistObject[] = (await getData()).items as ArtistObject[];
  // artistData.sort((a, b) => b.popularity - a.popularity);
  return (
    <div className="pb-20 bg-gray-900">
      <h1 className="text-xl font-bold mb-4 text-white mb-24">Top Artists</h1>
      <div className="px-72 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artistData.map((item, index) => (
          <div key={item.id} className="col-span-1">
            <div>
              <ArtistPortrait artist={item} rank={index + 1}/>
            </div>
          </div>
        ))}
      </div>
      <Header />
    </div>
  );
}
