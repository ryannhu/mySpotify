'use client'

import { ArtistObject } from "@/interface";
import Image from "next/image";

export default function ArtistPortrait({ artist, rank }: { artist: ArtistObject; rank: number }) {
    return (
        <a
        href={`/info/artist/${artist.id}`}
        className="flex flex-col items-center text-white bg-gray-800 rounded-lg shadow-lg p-4 hover:bg-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        style={{ width: '350px', height: '350px' }}> {/* Define the size of the container */}
            <div className="w-full h-full relative">
                {/* Image fills the div container, maintaining aspect ratio */}
                <Image
                    src={artist.images[0].url}
                    alt={artist.name}
                    fill
                    className="shadow-sm"
                    style={{objectFit: "contain"}}
                />
            </div>
            <h2 className="text-xl font-semibold mt-4 hover:text-blue-300 transition duration-200">{rank}. {artist.name}</h2>
        </a>
    );
}