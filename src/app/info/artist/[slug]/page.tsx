import { cookies } from "next/headers";
import { UserData, ArtistObject } from "@/interface";

async function GetData(id: string): Promise<ArtistObject> {
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
  const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(res);

  if (!res.ok) {
    throw new Error("Failed to fetch API, error code: " + res.status);
  }

  return res.json();
}

export default async function Page({ params }: { params: { slug: string } }) {
  const artistData = await GetData(params.slug);
  console.log(artistData);
  return (
    <div>
      <h1>Artist Info</h1>
      <p>{artistData.name}</p>
      <p>Popularity: {artistData.popularity}</p>
      <p>Followers: {artistData.followers.total}</p>
      <img src={artistData.images[1].url} alt="Artist Picture" />
      {artistData.genres.map((genre: string) => (
        <p key={genre}>{genre}</p>
      ))}
    </div>
  );
}
