import { cookies } from "next/headers";

export async function POST() {
  cookies().set("data", "", {
    maxAge: 0,
  });

  return Response.json({ message: "Logged out" }, { status: 200 });
}
