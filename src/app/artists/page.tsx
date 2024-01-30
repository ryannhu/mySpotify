import { cookies } from 'next/headers'

export interface UserData {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}

interface ImageObject {
    url: string,
    height: number,
    width: number,
}

interface ArtistObject {
    external_urls: object,
    followers: object,
    genres: string[],
    href: string,
    id: string,
    images: ImageObject[],
    name: string,
    popularity: number,
    type: string,
    uri: string
}

interface Response {
    href: string,
    limit: number,
    next: string,
    offset: number,
    previous: string,
    total: number,
    items: ArtistObject[]
}

async function getData(accessToken: string) {
    const params = {
        "limit": "50",
        "offset": "0",
        "time_range": "short_term",
    }
    const queryString = new URLSearchParams(params).toString();
    console.log(queryString);
    console.log(`https://api.spotify.com/v1/me/top/artists?${queryString}`)
    const res = await fetch(`https://api.spotify.com/v1/me/top/artists?${queryString}`, {
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
    const toParse = cookies().get('data')?.value;
    if (toParse == null) {
        throw Error("cookie is null");
    } 
    const data : UserData = JSON.parse(toParse) as UserData;

    const artistData :  ArtistObject[] = (await getData(data.access_token)).items as ArtistObject[];
    return (
        <div>
            <h1>
                Top Artists
            </h1>
            <ul>
                {artistData.map((item: ArtistObject) => (
                    <li key={item.id}>
                        <img src={item.images[1].url} alt="Artist Picture"/>
                        <p>{item.name}</p>
                        <p>Popularity: {item.popularity}</p>

                        {/* <p>{item.artists[0].name}</p> */}
                        {/* <p>{item.album.name}</p> */}
                        {/* <img src={item.album.images[1].url} alt="Album Art" /> */}
                    </li>
                ))}
            </ul>
        </div>
    )
}