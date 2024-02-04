import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  Cipher,
  Decipher,
} from "crypto";

// const SECRET_KEY = process.env.PASSWORD
// const IV = crypto.randomBytes(16);

function encrypt(data: string, key: Buffer, iv: Buffer): string {
  const cipher: Cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted: Buffer = cipher.update(data, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

function decrypt(data: string, key: Buffer, iv: Buffer): string {
  const decipher: Decipher = createDecipheriv("aes-256-cbc", key, iv);
  let decrypted: Buffer = decipher.update(Buffer.from(data, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf8");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.CURRENT_URL + "/api/callback";
  const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code || "",
      redirect_uri: REDIRECT_URI,
    }).toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    return new Response("An error occurred", { status: 500 });
  }

  cookies().set("data", JSON.stringify(data), {
    httpOnly: true,
  });

  redirect(`/home`);
}
