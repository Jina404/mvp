import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type CreateUserPayload = {
  fullName?: string;
  name?: string; // backward compatibility
  email?: string;
};

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateUserPayload;

    const email = payload.email?.trim() || null;
    const fullName = (payload.fullName ?? payload.name ?? "Unknown").trim();

    if (!fullName) {
      return NextResponse.json({ error: "fullName is required" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        email
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
