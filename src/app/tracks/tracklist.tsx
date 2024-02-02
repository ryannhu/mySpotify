"use client";

import { TrackData } from "@/interface";
import TrackItem from "./trackitem";

const TrackList: React.FC<{ tracks: TrackData[] }> = ({ tracks }) => {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <ul className="space-y-0.5">
        {tracks.map((track, index) => {
          const trackLink = "/info/tracks/" + track.id;
          return (
            <a href={trackLink}>
              <TrackItem track={track} index={index} />
            </a>
          );
        })}
      </ul>
    </div>
  );
};

export default TrackList;