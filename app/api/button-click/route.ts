import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { buttonName } = body;

  console.log(`Button clicked: ${buttonName}`);

  return NextResponse.json({
    message: `${buttonName} click received`,
  });
}
