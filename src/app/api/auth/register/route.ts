import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("Incoming request...");

  try {
    // 요청 본문을 파싱하기 전 로그 추가
    console.log("Parsing request body...");

    let body;
    try {
      body = await req.json();
      console.log("Parsed body:", body);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const { email, password, name } = body;

    // 입력값 검증
    if (!email || !password) {
      console.log("Validation failed: Missing email or password");
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    console.log("Checking for existing user...");
    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if (existingUser) {
      console.log("User already exists.");
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
    }

    console.log("Hashing password...");
    const hashedPassword = await hash(password, 10);

    console.log("Creating user in database...");

    console.log("Creating user with data:", {
      email,
      password: hashedPassword,
      name,
    });

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name,
      },
    });

    console.log("User created successfully:", user);

    return NextResponse.json({ message: "User registered successfully.", user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error.", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
