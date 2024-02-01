import { cookies } from "next/headers";
import { UserData, TrackData } from "@/interface";
import Header from "../components/header";

interface TopTrackData {
    href: string,
    limit: number,
    next: string,
    offset: number,
    previous: string,
    total: number,
    items: TrackData[]
}

async function getData() : Promise<TopTrackData> {
    const userData = cookies().get('data')?.value;
    if (userData == null) {
        throw new Error("cookie is null");
    }
    const data : UserData = JSON.parse(userData) as UserData;
    const accessToken = data.access_token;
    const params = {
        "limit": "50",
        "offset": "0",
        "time_range": "short_term",
    }
    const queryString = new URLSearchParams(params).toString();
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
    const data : TopTrackData = await getData() as TopTrackData;
    console.log(data.items);

    return (
        <div>
            <h1>Top Tracks</h1>
            <ul>
                {data.items.map((item : TrackData) => (
                    <li key={item.id}>
                        <a href={process.env.CURRENT_URL + "/info/tracks/" + item.id}>{item.name}</a>
                        <br/>
                        <a href={process.env.CURRENT_URL + "/info/artist/" + item.artists[0].id}>{item.artists[0].name}</a>
                        <br/>
                        <a href={process.env.CURRENT_URL + "/info/album/" + item.album.id}>{item.album.name}</a>
                        <img src={item.album.images[1].url} alt="Album Art" />
                    </li>
                ))}
            </ul>
            <Header/>
        </div>
    );
}

