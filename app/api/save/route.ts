// app/api/save/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({
    message: "Save API working 🚀",
    received: body,
  });
}
