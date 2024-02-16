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
import Header from "@/app/components/header";
import ChartComponent from "./chart";
import { ChartData } from "chart.js";

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

const MsToMinutes = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds}`;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const trackData = await GetData(params.slug);
  const audioFeatures = await GetTrackAudioFeatures(params.slug);

  const chartData: ChartData = {
    labels: [
      "Acousticness",
      "Danceability",
      "Energy",
      "Instrumentalness",
      "Liveness",
      "Speechiness",
      "Valence",
    ],
    datasets: [
      {
        label: "Audio Features",
        data: [
          audioFeatures.acousticness,
          audioFeatures.danceability,
          audioFeatures.energy,
          audioFeatures.instrumentalness,
          audioFeatures.liveness,
          audioFeatures.speechiness,
          audioFeatures.valence,
        ],
      },
    ],
  };
  // Improved styling with Tailwind CSS
  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col items-center justify-start py-10">
      <h1 className="text-3xl font-bold mb-4">{trackData.name}</h1>
      <h2 className="text-xl font-semibold mb-2">
        {trackData.artists.map((artist, index) => (
          <span key={artist.id}>
            <a
              href={`/info/artist/${artist.id}`}
              className="text-blue-400 hover:text-blue-300 transition duration-150 ease-in-out"
            >
              {artist.name}
              {index < trackData.artists.length - 1 ? ", " : ""}
            </a>
          </span>
        ))}
      </h2>

      <a
        href={`/info/album/${trackData.album.id}`}
        className="text-blue-400 hover:text-blue-300 transition duration-150 ease-in-out font-semibold"
      >
        {trackData.album.name}
      </a>
      <div className="my-4">
        <img
          src={trackData.album.images[1].url}
          alt="Album Art"
          className="rounded-lg shadow-lg"
        />
      </div>
      <div className="text-white flex flex-col items-center py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <TableItem
              item={MsToMinutes(trackData.duration_ms)}
              description="Duration"
            />
            <TableItem
              item={new MusicalNote(audioFeatures.key).getNoteName()}
              description="Key"
            />
            <TableItem
              item={audioFeatures.mode ? "Major" : "Minor"}
              description="Modality"
            />
            <TableItem
              item={audioFeatures.time_signature + "/4"}
              description="Time Signature"
            />
            <TableItem item={Math.round(audioFeatures.tempo)} description="Tempo (BPM)" />
            <TableItem
              item={trackData.popularity + "%"}
              description="Popularity"
            />
            {/* <div className="bg-gray-700 p-2 rounded-md">
          Preview: <audio controls src={trackData.preview_url}></audio>
        </div> */}
          </div>
        </div>
        <div className="w-full mt-20 mx-4">
        <ChartComponent data={chartData} />
      </div>
      </div>

    </div>
  );
}
