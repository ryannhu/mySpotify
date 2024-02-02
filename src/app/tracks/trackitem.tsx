"use client";

import { TrackData } from "@/interface";

interface TrackProps {
  track: TrackData;
  index: number;
}

const Track: React.FC<TrackProps> = ({ track, index }) => {
  return (
    <li
      key={track.id}
      className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
    >
      <div className="flex items-center">
        <span className="text-gray-300 text-sm">{index + 1}</span>
        <img
          className="h-12 w-12 rounded-full object-cover mx-4"
          src={track.album.images[0].url}
          alt=""
        />
        <div>
          <p className="text-white text-sm font-medium">{track.name}</p>
          <p className="text-gray-400 text-xs">{track.artists[0].name}</p>
        </div>
      </div>
      <div>
        <p className="text-gray-300 text-sm">{track.album.name}</p>
      </div>
      {/* <div>
              <p className="text-gray-300 text-sm">{track.dateAdded}</p>
            </div> */}
      <div>
        <p className="text-gray-300 text-sm">{track.duration_ms}</p>
      </div>
    </li>
  );
};

export default Track;
