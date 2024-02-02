import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return NextResponse.json({ name: "Hello World" }, { status: 200 });
}
