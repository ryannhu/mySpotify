import { cookies } from "next/headers";
import {
  UserData,
  ArtistObject,
  MusicalNote,
  AlbumObject,
  TrackData,
  AudioFeatures,
} from "@/interface";
import TableItem from "./tableitem";



async function GetData(id: string): Promise<TrackData> {
  const userData = cookies().get("data")?.value;
  if (userData == null) {
    throw new Error("cookie is null");
  }
  const data: UserData = JSON.parse(userData) as UserData;
  const accessToken = data.access_token;
  const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch API");
  }
  return res.json();
}

async function GetTrackAudioFeatures(id: string): Promise<AudioFeatures> {
  const userData = cookies().get("data")?.value;
  if (userData == null) {
    throw new Error("cookie is null");
  }
  const data: UserData = JSON.parse(userData) as UserData;
  const accessToken = data.access_token;
  const res = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch API");
  }

  return res.json();
}

export default async function Page({ params }: { params: { slug: string } }) {
  const trackData = await GetData(params.slug);
  const audioFeatures = await GetTrackAudioFeatures(params.slug);

  // Improved styling with Tailwind CSS
  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-start py-10">
      <h1 className="text-3xl font-bold mb-4">{trackData.name}</h1>
      <h2 className="text-xl font-semibold mb-2">
        {trackData.artists.map((artist, index) => (
          <span key={artist.id}>
            <a href={`/info/artist/${artist.id}`} className="text-blue-400 hover:text-blue-300 transition duration-150 ease-in-out">
              {artist.name}{index < trackData.artists.length - 1 ? ', ' : ''}
            </a>
          </span>
        ))}
      </h2>

      <a href={`/info/album/${trackData.album.id}`} className="text-blue-400 hover:text-blue-300 transition duration-150 ease-in-out font-semibold">
        {trackData.album.name}
      </a>
      <div className="my-4">
        <img src={trackData.album.images[1].url} alt="Album Art" className="rounded-lg shadow-lg" />
      </div>
      <div className="text-white flex flex-col items-center py-10">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <TableItem item={trackData.duration_ms} description="Duration"/>
      <TableItem item={new MusicalNote(audioFeatures.key).getNoteName()} description="Key"/>
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded">
        <span className="text-2xl font-bold">Minor</span>
        <span className="text-sm mt-2">Modality</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded">
        <span className="text-2xl font-bold">4</span>
        <span className="text-sm mt-2">Time Signature</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded">
        <span className="text-2xl font-bold">103</span>
        <span className="text-sm mt-2">Tempo (BPM)</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded">
        <span className="text-2xl font-bold">48%</span>
        <span className="text-sm mt-2">Popularity</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded">
        <span className="text-2xl font-bold">77</span>
        <span className="text-sm mt-2">Bars</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded">
        <span className="text-2xl font-bold">311</span>
        <span className="text-sm mt-2">Beats</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded">
        <span className="text-2xl font-bold">10</span>
        <span className="text-sm mt-2">Sections</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded">
        <span className="text-2xl font-bold">751</span>
        <span className="text-sm mt-2">Segments</span>
      </div>
    </div>
  </div>
</div>
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        <p className="bg-gray-700 p-2 rounded-md">Popularity: {trackData.popularity}</p>
        <p className="bg-gray-700 p-2 rounded-md">Duration: {trackData.duration_ms} ms</p>
        <p className="bg-gray-700 p-2 rounded-md">Explicit: {trackData.explicit ? "Yes" : "No"}</p>
        <div className="bg-gray-700 p-2 rounded-md">
          Preview: <audio controls src={trackData.preview_url}></audio>
        </div>
        <p className="bg-gray-700 p-2 rounded-md">Acousticness: {audioFeatures.acousticness}</p>
        <p className="bg-gray-700 p-2 rounded-md">Danceability: {audioFeatures.danceability}</p>
        <p className="bg-gray-700 p-2 rounded-md">Energy: {audioFeatures.energy}</p>
        <p className="bg-gray-700 p-2 rounded-md">Instrumentalness: {audioFeatures.instrumentalness}</p>
        <p className="bg-gray-700 p-2 rounded-md">Key: {new MusicalNote(audioFeatures.key).getNoteName()}</p>
        <p className="bg-gray-700 p-2 rounded-md">Liveness: {audioFeatures.liveness}</p>
        <p className="bg-gray-700 p-2 rounded-md">Loudness: {audioFeatures.loudness}</p>
        <p className="bg-gray-700 p-2 rounded-md">Mode: {audioFeatures.mode}</p>
        <p className="bg-gray-700 p-2 rounded-md">Speechiness: {audioFeatures.speechiness}</p>
        <p className="bg-gray-700 p-2 rounded-md">Tempo: {audioFeatures.tempo}</p>
        <p className="bg-gray-700 p-2 rounded-md">Time Signature: {audioFeatures.time_signature}</p>
        <p className="bg-gray-700 p-2 rounded-md">Valence: {audioFeatures.valence}</p>
      </div>
    </div>
  );
}