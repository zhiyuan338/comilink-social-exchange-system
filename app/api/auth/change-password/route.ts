import { NextResponse } from "next/server";
import { authErrorResponse, requireUser } from "@/app/lib/auth";
import { getStringField, readJson } from "@/app/lib/http";
import { hashPassword, verifyPassword } from "@/app/lib/password";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await readJson(request);
    const oldPassword = getStringField(body, "oldPassword", { trim: false });
    const newPassword = getStringField(body, "newPassword", { trim: false });

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Old password and new password are required." },
        { status: 400 },
      );
    }

    const account = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oldPasswordMatches = await verifyPassword(
      oldPassword,
      account.passwordHash,
    );

    if (!oldPasswordMatches) {
      return NextResponse.json(
        { error: "Old password is incorrect." },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(newPassword) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
