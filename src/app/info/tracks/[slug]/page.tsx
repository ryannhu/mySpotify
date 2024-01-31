import { cookies } from "next/headers";
import { UserData, ArtistObject, MusicalNote, AlbumObject } from "@/interface";

interface TrackData {
    album: AlbumObject,
    artists: ArtistObject[],
    available_markets: string[],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_ids: object,
    external_urls: object,
    href: string,
    id: string,
    is_playable: boolean,
    linked_from: object,
    restrictions: object,
    name: string,
    popularity: number,
    preview_url: string,
    track_number: number,
    type: string,
    uri: string,
    is_local: boolean
};

interface AudioFeatures {
    acousticness: number,
    analysis_url: string,
    danceability: number,
    duration_ms: number,
    energy: number,
    id: string,
    instrumentalness: number,
    key: number,
    liveness: number,
    loudness: number,
    mode: number,
    speechiness: number,
    tempo: number,
    time_signature: number,
    track_href: string,
    type: string,
    uri: string,
    valence: number
}

 

async function GetData(id: string) : Promise<TrackData> {
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

    if (!res.ok) {
        throw new Error("Failed to fetch API");
    }

    return res.json();
}

async function GetTrackAudioFeatures(id: string) : Promise<AudioFeatures> {
    const userData = cookies().get('data')?.value;
    if (userData == null) {
        throw new Error("cookie is null");
    }
    const data : UserData = JSON.parse(userData) as UserData;
    const accessToken = data.access_token;
    const res = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch API");
    }

    return res.json();
}


export default async function Page({ params } : { params: { slug: string} }) {
    const trackData = await GetData(params.slug);
    const audioFeatures = await GetTrackAudioFeatures(params.slug);

    console.log(trackData)
    console.log(audioFeatures)
    return (
    <div>
         Track Info
            <p>{trackData.name}</p>
            <p>{trackData.artists[0].name}</p>
            <p>{trackData.album.name}</p>
            <img src={trackData.album.images[1].url} alt="Album Art" />
            <p>Popularity: {trackData.popularity}</p>
            <p>Duration: {trackData.duration_ms}</p>
            <p>Explicit: {trackData.explicit ? "Yes" : "No"}</p>
            <p>Preview: <audio controls src={trackData.preview_url}></audio></p>
            <p>Acousticness: {audioFeatures.acousticness}</p>
            <p>Danceability: {audioFeatures.danceability}</p>
            <p>Energy: {audioFeatures.energy}</p>
            <p>Instrumentalness: {audioFeatures.instrumentalness}</p>
            <p>Key: {new MusicalNote(audioFeatures.key).getNoteName()}</p>
            <p>Liveness: {audioFeatures.liveness}</p>
            <p>Loudness: {audioFeatures.loudness}</p>
            <p>Mode: {audioFeatures.mode}</p>
            <p>Speechiness: {audioFeatures.speechiness}</p>
            <p>Tempo: {audioFeatures.tempo}</p>
            <p>Time Signature: {audioFeatures.time_signature}</p>
            <p>Valence: {audioFeatures.valence}</p>
    </div>
    );
}