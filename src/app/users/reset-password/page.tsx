"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const sendResetLink = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "비밀번호 재설정 요청 실패");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setMessage("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
      setIsEmailSent(true);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-10 text-xl font-semibold">비밀번호 재설정</h1>

      {!isEmailSent ? (
        <>
          <label htmlFor="email" className="mb-2 block">
            등록된 이메일을 입력하세요.
          </label>
          <input
            id="email"
            type="email"
            placeholder="abc@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 block w-full border p-2"
          />
          <button onClick={() => sendResetLink.mutate()} disabled={!email} className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-400">
            비밀번호 재설정 링크 보내기
          </button>
        </>
      ) : (
        <p className="text-green-500">{message}</p>
      )}

      <div className={"mt-10 flex justify-center hover:underline"}>
        <Link href={"/"}>To the Home</Link>
      </div>
    </div>
  );
}
