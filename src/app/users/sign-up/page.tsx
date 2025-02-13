"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();

  const [step, setStep] = useState<"verify" | "register" | "third">("verify");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ name: "", password: "" });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const sendVerification = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send verification code.");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setMessage(data.message || "Verification code sent to email.");
      setStep("register");
    },
    onError: (error: Error) => setMessage(`Error: ${error.message}`),
  });

  const validateCode = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "잘못된 인증코드입니다.");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setIsVerified(true);
      setStep("third");
      setMessage(data.message || "Email verified successfully!");
    },
    onError: (error: Error) => setMessage(`Error: ${error.message}`),
  });

  const registerUser = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setMessage(data.message || "Registration successful!");
      // * 회원 가입에 성공하면 이동할 page
      router.push("/sign-in");
    },
    onError: (error: Error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-10 text-2xl font-semibold">회원 가입하기</h1>

      {step === "verify" ? (
        <>
          <p className={"mb-4 border-b-4 pb-1 text-xl"}>Step 1. 이메일 입력하기</p>

          <label htmlFor="email" className="mb-2 block">
            사용하실 이메일을 입력해 주세요.
          </label>
          <input
            id="email"
            type="email"
            placeholder="abc@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 block w-full border p-2"
          />
          <button
            onClick={() => sendVerification.mutate()}
            disabled={!isValidEmail(email) || sendVerification.isPending}
            className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-400">
            {sendVerification.isPending ? "인증 코드 보내는 중..." : "이메일로 인증 코드 보내기"}
          </button>
        </>
      ) : step === "register" ? (
        <>
          <p className={"mb-4 border-b-4 pb-1 text-xl"}>Step 2. 인증코드 입력하기</p>

          <div className={clsx("", { hidden: !message || message === "Error: 이미 가입된 이메일입니다." })}>
            <label htmlFor="token" className="mb-2 mt-2 block">
              인증코드를 입력해 주세요.
            </label>

            <input
              id="token"
              type="text"
              placeholder="6자리 인증코드"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mb-1 block w-full border p-2"
            />
            <button
              onClick={() => validateCode.mutate()}
              disabled={!token || validateCode.isPending}
              className="mt-2 w-full rounded-md bg-green-600 p-2 text-white hover:bg-green-500">
              {validateCode.isPending ? "인증 중..." : "인증하기"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={"mb-4 border-b-4 pb-1 text-xl"}>Step 3. 회원가입 완료하기</p>

          <label htmlFor="name" className="mb-1 block">
            Name:
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mb-2 block w-full border p-2"
          />

          <label htmlFor="password" className="mb-1 block">
            Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mb-2 block w-full border p-2"
          />

          <button
            onClick={() => registerUser.mutate()}
            disabled={registerUser.isPending || !formData.name || !formData.password}
            className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-400">
            {registerUser.isPending ? "Registering..." : "Register"}
          </button>
        </>
      )}

      {message && <p className={`mt-2 ${message.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

      <div className={"mt-10 flex justify-center hover:underline"}>
        <Link href={"/"}>Back to Home</Link>
      </div>
    </div>
  );
}
