"use client";

import { useRouter } from "next/navigation";
const LoginButton = () => {
  const router = useRouter();

  async function onLogin() {
    const res = (await fetch("api/login", { method: "GET" })).json();

    const resData = await res;
    const CLIENT_ID = resData.client_id;
    const REDIRECT_URI = resData.url + "/api/callback";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "code";
    const SCOPES = [
      "user-read-private",
      "user-read-email",
      "user-top-read",
      "user-read-playback-state",
      "user-read-recently-played",
      "user-read-currently-playing",
      "playlist-read-private",
    ];
    // const STATE = generateRandomString(16);

    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES.join(" "))}&show_dialog=true`;
    router.push(authUrl);
  }

  return (
    <div>
      <button
        className="border border-white rounded px-6 py-2 mt-4 hover:bg-white hover:text-gray-900"
        onClick={onLogin}
      >
        Login
      </button>
    </div>
  );
};

export default LoginButton;
