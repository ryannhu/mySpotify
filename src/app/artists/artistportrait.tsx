'use client'

import { ArtistObject } from "@/interface";
import Image from "next/image";

export default function ArtistPortrait({ artist }: { artist: ArtistObject }) {
    return (
        <div className="flex flex-col items-center">
            <Image
                src={artist.images[0].url}
                alt={artist.name}
                className="rounded-full w-40 h-40"
                width={160}
                height={160}
            />
            <a href={`/info/artist/${artist.id}`} className="text-2xl font-bold mt-4">{artist.name}</a>
        </div>
    );
}