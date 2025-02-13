import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email and token are required." }, { status: 400 });
    }

    // 인증 코드 확인
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { email },
    });

    if (!verificationToken || verificationToken.token !== token) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    }

    // 인증 성공 시, 인증 코드 삭제
    await prisma.emailVerificationToken.delete({
      where: { email },
    });

    return NextResponse.json({ message: "인증에 성공하였습니다." });
  } catch (error) {
    console.error("Code validation error:", error);
    return NextResponse.json({ error: "Failed to validate code." }, { status: 500 });
  }
}
