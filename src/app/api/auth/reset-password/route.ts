import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "이메일을 입력하세요." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "등록되지 않은 이메일입니다." }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15분 후 만료
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

    await resend.emails.send({
      from: "Your Service Name <no-reply@supaneer.com>",
      to: email,
      subject: "비밀번호 재설정",
      text: `비밀번호를 재설정하려면 다음 링크를 클릭하세요: ${resetLink}`,
    });

    return NextResponse.json({ message: "비밀번호 재설정 링크가 이메일로 전송되었습니다." });
  } catch (error) {
    console.error("비밀번호 재설정 오류:", error);
    return NextResponse.json({ error: "비밀번호 재설정 요청 실패" }, { status: 500 });
  }
}
