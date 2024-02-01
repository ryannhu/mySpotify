import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.CURRENT_URL + "/api/callback";
    const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
 
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code || '',
            redirect_uri: REDIRECT_URI
        }).toString()
    });
    
    const data = await response.json();

    if (!response.ok) {
        return new Response('An error occurred', { status: 500 });
    }

    cookies().set('data', JSON.stringify(data), {
        httpOnly: true
    });

    redirect(`/home`); 
}

