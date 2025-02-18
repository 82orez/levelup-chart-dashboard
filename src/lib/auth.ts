import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import Kakao from "next-auth/providers/kakao";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60 * 2, // 2 hours
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // 이메일로 회원 가입 여부 판단
        // 클라이언트로부터 넘겨 받은 이메일이 서버에 등록된 사용자인지 확인
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("가입되지 않은 이메일입니다.");
        }

        if (!user.credentials) {
          throw new Error("Kakao 로그인을 이용해 주세요.");
        }

        // 비밀번호 검증
        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("비밀 번호가 일치하지 않습니다.");
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  pages: { signIn: "/sign-in" },
  callbacks: {
    jwt: async ({ user, token }) => {
      console.log("user: ", user);
      console.log("token: ", token);

      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        ...token,
      },
    }),
    signIn: async ({ account, user, profile, credentials, email }) => {
      console.log("account: ", account);
      console.log("profile: ", profile);
      console.log("user: ", user);
      console.log("email: ", email);
      console.log("credentials: ", credentials);

      let forCheckEmail = "";

      if (account?.provider === "kakao") {
        forCheckEmail = profile?.["kakao_account"]?.email; // 실제 카카오 프로필의 이메일 경로를 확인해야 함

        const existingUser = await prisma.user.findFirst({
          where: {
            email: forCheckEmail,
            // *
            name: "M'ZYC_g#E$I!",
          },
        });

        if (existingUser) {
          // * 반환값: 오류를 표시할 redirect 클라이언트 경로(여기에서는 /users/sign-in) + ? + 쿼리문(여기에서는 error=EmailExists & existEmail=${forCheckEmail})
          // 오류를 표시할 클라이언트 경로는 다른 경로로(redirect) 변경 가능.
          // existingUser 가 존재(error=EmailExists)하고 그 해당 이메일 계정은 existEmail=${forCheckEmail}
          return `/users/sign-in?error=EmailExists&existEmail=${forCheckEmail}`;
        }
      }

      return true;
    },
  },
};
