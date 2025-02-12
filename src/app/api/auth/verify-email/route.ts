import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // 랜덤 6자리 숫자 생성
    const token = crypto.randomInt(100000, 999999).toString();

    // 기존 이메일 인증 코드 삭제
    await prisma.emailVerificationToken.deleteMany({
      where: { email },
    });

    // 새로운 인증 코드 저장 (5분 후 만료)
    await prisma.emailVerificationToken.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const data = await resend.emails.send({
      from: "Your Service Name <no-reply@supaneer.com>",
      to: email,
      subject: "Your verification code",
      text: `Your verification code is: ${token}`,
    });

    return NextResponse.json({ message: "Verification code sent." });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Failed to send verification code." }, { status: 500 });
  }
}
