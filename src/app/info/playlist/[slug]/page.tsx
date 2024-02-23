import { cookies } from "next/headers";
import { UserData, PlaylistObject, PlaylistTrackObject, TrackResponse } from "@/interface";
import { redirect } from "next/navigation";
import TrackList from "@/app/tracks/tracklist";
import { Suspense } from "react";
import Track from "@/app/tracks/trackitem";

async function GetPlaylistInfo(id: string): Promise<any> {
    
}

async function GetPlaylistTracks(id: string): Promise<TrackResponse<PlaylistTrackObject>> {
  const userData = cookies().get("data")?.value;
  if (userData == null) {
    redirect("/");
  }
  const data: UserData = JSON.parse(userData) as UserData;
  const accessToken = data.access_token;
  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });


  if (!res.ok) {
    throw new Error("Failed to fetch API, error code: " + res.status);
  }

  let responseData = await res.json() as TrackResponse<PlaylistTrackObject>;
  let next = responseData.next;
  while (next != null) {
    const res = await fetch(
        next,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const nextResponse = await res.json() as TrackResponse<PlaylistTrackObject>;
      responseData.items = responseData.items.concat(nextResponse.items);
      next = nextResponse.next;
  }

  return responseData;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const playlistResponse = await GetPlaylistTracks(params.slug);
  const playlistTracks = playlistResponse.items;
  const trackList = playlistTracks.map((track) => track.track);
  return (
    <div className="w-screen flex justify-center items-center">
      {/* <ul>
        {playlistTracks.map(({track}) => {
          return (
            <li key={track.id}>
              <a href={`/info/tracks/${track.id}`}>{track.name}</a>
            </li>
          );
        })}
      </ul> */}
      <div className="w-1/2 flex justify-center items-center">
      <TrackList tracks={trackList}/>
      </div>
    </div>
  );
}
