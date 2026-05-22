import { NextResponse } from "next/server";
import { authErrorResponse, requireUser } from "@/app/lib/auth";
import {
  getCollectionItemsForUser,
  resolveCollectionEventId,
} from "@/app/lib/collections";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const eventId = await resolveCollectionEventId(
      searchParams.get("eventId"),
    );
    const items = await getCollectionItemsForUser(user.id, eventId);

    return NextResponse.json({ items });
  } catch (error) {
    return authErrorResponse(error);
  }
}
