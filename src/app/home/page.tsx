import { redirect } from "next/navigation";
import { UserData } from "@/interface";
import { cookies } from "next/headers";
import Header from "@/app/components/header"
import LogoutButton from "../components/logoutButton";

interface ProfileData {
    display_name: string,
    followers: {
        total: number
    },
    images: {
        url: string
    }[],
    external_urls: {
        spotify: string
    }
}

async function getData() : Promise<ProfileData> {
    const userData = cookies().get('data')?.value;
    if (userData == null) {
        throw new Error("cookie is null");
    }
    const data : UserData = JSON.parse(userData) as UserData;
    const accessToken = data.access_token;
    const res = await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
    });
    if (res.status === 401) {
        // use redirect, maybe should make function
    }
    if (!res.ok) {
        throw new Error("Failed to fetch API" + res.status + res.statusText);
    }
    return res.json();
}

function logout() {
    cookies().set('data', '', {
        maxAge: -1
    });
    redirect('/');
}

export default async function Page() {
    const data = await getData();

    const profilePicUrl = data.images[0].url;
    const username = data.display_name;
    const followers = data.followers.total;
    
    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col items-center justify-center">
            <div className="-mt-40">
                <img src={profilePicUrl} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
                <h2 className="text-4xl font-bold">{username}</h2>
            </div>

            <div className="flex space-x-10 my-4">
                <div className="text-center">
                    <p className="text-2xl">{followers}</p>
                    <p className="text-sm uppercase">Followers</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl">{0}</p>
                    <p className="text-sm uppercase">Following</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl">{23}</p>
                    <p className="text-sm uppercase">Playlists</p>
                </div>
            </div>
            <LogoutButton/>
            <Header/>
        </div>
    );
}


