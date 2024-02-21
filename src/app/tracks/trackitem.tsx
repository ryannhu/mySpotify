"use client";

import { TrackData } from "@/interface";

interface TrackProps {
  track: TrackData;
  index: number;
}

const MstoSongDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
};

const Track: React.FC<TrackProps> = ({ track, index }) => {
  const artistsNames = track.artists.map((artist) => artist.name).join(", ");
  return (
    <li
      key={track.id}
      className="bg-gray-800 rounded-lg p-4 grid grid-cols-9 items-center justify-between"
    >
      <div className="flex items-center col-start-1 col-end-3">
        <span className="text-gray-300 text-sm">{index + 1}</span>
        <img
          className="h-12 w-12 object-cover mx-4"
          src={track.album.images[0].url}
          alt=""
        />
        <div>
          <p className="text-white text-sm font-medium">{track.name}</p>
          <p className="text-gray-400 text-xs">{artistsNames}</p>
        </div>
      </div>
      <div className="flex col-start-5 col-end-8 overflow-hidden whitespace-nowrap">
        <p className="text-gray-300 text-sm text-ellipsis overflow-hidden">
          {track.album.name}
        </p>
      </div>
      <div className="flex place-content-end col-start-9 pr-7">
        <p className="text-gray-300 text-sm">
          {MstoSongDuration(track.duration_ms)}
        </p>
      </div>
    </li>
  );
};

export default Track;
