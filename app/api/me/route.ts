import { NextResponse } from "next/server";
import { authErrorResponse, requireUser } from "@/app/lib/auth";
import { getAppUrl } from "@/app/lib/http";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const appUrl = getAppUrl(request);

    return NextResponse.json({
      id: user.id,
      qq: user.qq,
      username: user.username,
      token: user.token,
      stampImageUrl: user.stampImageUrl,
      nfcUrl: `${appUrl}/u/${encodeURIComponent(user.token)}`,
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
