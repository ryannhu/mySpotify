'use client'
import React from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { access } from "fs";
import { redirect } from "next/navigation";


async function getData(accessToken: string) {
    const params = {
        "limit": "50",
        "offset": "0",
        "time_range": "short_term",
    }
    const queryString = new URLSearchParams(params).toString();
    console.log(queryString);
    console.log(`https://api.spotify.com/v1/me/`)
    const res = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
    });


    console.log(res);

    if (!res.ok) {
        throw new Error("Failed to fetch API");
    }

    return res.json();
}

export default async function Page() {
    const searchParams = useSearchParams();

    const accessToken = searchParams.get('access_token')!;

    const data = await getData(accessToken);
    console.log(data);
    return (
        <div>
            <h1>Dashboard</h1>
            <p>{data.display_name}</p>
            <p>{data.email}</p>
            <p>{data.id}</p>
            <img src={data.images[1].url} alt="Profile Picture" />

            <a href={process.env.CURRENT_URL + `/tracks?access_token=${accessToken}`}>Tracks</a>
            <div>
            <a href={process.env.CURRENT_URL + '/artists'}>Artists</a>
            </div>
        </div>
    );
}

