import Image from "next/image";

export default function Home() {
  const CLIENT_ID = process.env.CLIENT_ID;
  const REDIRECT_URI = process.env.CURRENT_URL + "/api/callback";
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'code';
  const SCOPES = ['user-read-private', 'user-read-email', 'user-top-read'];
  // const STATE = generateRandomString(16);

  const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES.join(' '))}`;


  return (
    <div>
      <a href={authUrl}>Login</a>
    </div>
  );
}
