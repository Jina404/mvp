import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type CreateUserPayload = {
  name: string;
  email: string;
};

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as CreateUserPayload;
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email
    }
  });

  return NextResponse.json(user, { status: 201 });
}
