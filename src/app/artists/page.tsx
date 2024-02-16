import { cookies } from "next/headers";
import { UserData, ArtistObject } from "@/interface";
import Header from "../components/header";

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

  const params = {
    limit: "50",
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

  return res.json();
}

export default async function Page() {
  let artistData: ArtistObject[] = (await getData()).items as ArtistObject[];
  // artistData.sort((a, b) => b.popularity - a.popularity);
  return (
    <div className="pb-20">
      <h1>Top Artists</h1>
      <ul>
        {artistData.map((item: ArtistObject, index) => (
          <li key={item.id}>
            <div>
            <img src={item.images[1].url} alt="Artist Picture" />
            <a href={`/info/artist/${item.id}`}>{index + 1}. {item.name}</a>
            </div>


          </li>
        ))}
      </ul>
      <Header />
    </div>
  );
}
