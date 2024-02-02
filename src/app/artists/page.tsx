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
  const artistData: ArtistObject[] = (await getData()).items as ArtistObject[];
  return (
    <div>
      <h1>Top Artists</h1>
      <ul>
        {artistData.map((item: ArtistObject) => (
          <li key={item.id}>
            <img src={item.images[1].url} alt="Artist Picture" />
            <a href={`/info/artist/${item.id}`}>{item.name}</a>
            <p>Popularity: {item.popularity}</p>

            {/* <p>{item.artists[0].name}</p> */}
            {/* <p>{item.album.name}</p> */}
            {/* <img src={item.album.images[1].url} alt="Album Art" /> */}
          </li>
        ))}
      </ul>
      <Header />
    </div>
  );
}
