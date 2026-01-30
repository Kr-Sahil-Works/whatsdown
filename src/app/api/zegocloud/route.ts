import { NextResponse } from "next/server";
import { generateToken04 } from "@/app/api/zegocloud/zegoServerAssistant";

export async function GET(req: Request) {
  const appID = Number(process.env.ZEGO_APP_ID);
  const serverSecret = process.env.ZEGO_SERVER_SECRET;

  if (!appID || !serverSecret) {
    return NextResponse.json(
      { error: "Missing ZEGO env vars" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const userID = searchParams.get("userID");

  if (!userID) {
    return NextResponse.json(
      { error: "Missing userID" },
      { status: 400 }
    );
  }

  const token = generateToken04(
    appID,
    userID,
    serverSecret,
    3600,
    ""
  );

  return NextResponse.json({ token, appID });
}
