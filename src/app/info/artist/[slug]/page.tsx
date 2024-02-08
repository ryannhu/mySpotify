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

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-6">Artist Info</h1>
      <p className="text-2xl font-semibold mb-2">{artistData.name}</p>
      <p className="text-lg mb-1">Popularity: {artistData.popularity}</p>
      <p className="text-lg mb-4">Followers: {artistData.followers.total.toLocaleString()}</p>
      <img src={artistData.images[1].url} alt="Artist Picture" className="w-48 h-48 object-cover rounded-full mb-4" />
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {artistData.genres.map((genre: string, index: number) => (
          <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">{genre}</span>
        ))}
      </div>
    </div>
  );
}

