import { cookies } from "next/headers";
import { UserData, AlbumObject } from "@/interface";
import { redirect } from "next/navigation";

async function GetData(id: string): Promise<AlbumObject> {
  const userData = cookies().get("data")?.value;
  if (userData == null) {
    redirect("/");
  }
  const data: UserData = JSON.parse(userData) as UserData;
  const accessToken = data.access_token;
  const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch API, error code: " + res.status);
  }

  return res.json();
}

export default async function Page({ params }: { params: { slug: string } }) {
  const albumData = await GetData(params.slug);
  console.log(albumData);
  return (
    <div>
      <h1>Album Info</h1>
      <p>{albumData.name}</p>
      <p>Release Date: {albumData.release_date}</p>
      <p>Popularity: {albumData.popularity}</p>
      <p>
        Artists:{" "}
        {albumData.artists.map((artist, index) => {
          return (
            <span key={artist.id}>
              <a href={`/info/artist/${artist.id}`}>
                {artist.name}
                {index < albumData.artists.length - 1 ? ", " : ""}
              </a>
            </span>
          );
        })}
      </p>
      <img src={albumData.images[1].url} alt="Album Picture" />
      {albumData.genres.map((genre: string) => (
        <p key={genre}>{genre}</p>
      ))}
      <ul>
        {albumData.tracks.items.map((track) => {
          return (
            <li key={track.id}>
              <a href={`/info/tracks/${track.id}`}>{track.name}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
