'use client'
import React from "react";
import { useSearchParams } from "next/navigation";


async function getData(accessToken: string) {
    const params = {
        "limit": "50",
        "offset": "0",
        "time_range": "short_term",
    }
    const queryString = new URLSearchParams(params).toString();
    console.log(queryString);
    console.log(`https://api.spotify.com/v1/me/top/tracks?${queryString}`)
    const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?${queryString}`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch API");
    }

    return res.json();
}

export default async function Page() {
    const searchParams = useSearchParams();

    const accessToken = searchParams.get('access_token')!;

    const data = await getData(accessToken);
    console.log(data.items);

    return (
        <div>
            <h1>Top Tracks</h1>
            <ul>
                {data.items.map((item: any) => (
                    <li key={item.id}>
                        <p>{item.name}</p>
                        <p>{item.artists[0].name}</p>
                        <p>{item.album.name}</p>
                        <img src={item.album.images[1].url} alt="Album Art" />
                    </li>
                ))}
            </ul>
        </div>
    );
}

