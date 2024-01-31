import { redirect } from "next/navigation";
import { UserData } from "@/interface";
import { cookies } from "next/headers";


async function getData() {
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
    const data = await getData();
    
    return (
        <div>
            <h1>Dashboard</h1>
            <p>{data.display_name}</p>
            <p>{data.email}</p>
            <p>{data.id}</p>
            <img src={data.images[1].url} alt="Profile Picture" />

            <a href={process.env.CURRENT_URL + `/tracks`}>Tracks</a>
            <div>
            <a href={process.env.CURRENT_URL + '/artists'}>Artists</a>
            </div>
        </div>
    );
}

