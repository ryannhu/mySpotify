import { cookies } from "next/headers";
import { UserData } from "@/app/artists/page";

async function GetData(id: string) {
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
    const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
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

export default async function Page({ params } : { params: { slug: string} }) {


    const trackData = await GetData(params.slug);
    console.log(trackData)
    return (
    <div>
         Track Info
    </div>
    );
}