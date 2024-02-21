import { cookies } from "next/headers";
import { UserData, PlaylistObject } from "@/interface";
import Header from "@/app/components/header";

interface PlaylistData {
  href: string;
  items: PlaylistObject[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

async function getData(): Promise<PlaylistData> {
  const userData = cookies().get("data")?.value;
  if (userData == null) {
    throw new Error("cookie is null");
  }
  const data: UserData = JSON.parse(userData) as UserData;
  const accessToken = data.access_token;

  const params = {
    limit: "50",
    offset: "0",
  };
  const queryString = new URLSearchParams(params).toString();
  const res = await fetch(
    `https://api.spotify.com/v1/me/playlists?${queryString}`,
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
  const data = await getData();
  const playlists = data.items;
  return (
    <div>
      <h1>Playlists</h1>
      {playlists.map((playlist: PlaylistObject) => (
        <div key={playlist.id}>
          <a href={`/info/playlist/${playlist.id}`}>{playlist.name}</a>
          <p>{playlist.description}</p>
          {playlist.images.length > 0 ? (
            <img src={playlist.images[0].url} alt="Playlist Art" />
          ) : null}
        </div>
      ))}
      <Header />
    </div>
  );
}
