"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { GoEye, GoEyeClosed } from "react-icons/go";
import clsx from "clsx";

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = /^(?=.*[A-Za-z]).{6,}$/.test(password);
  const isPasswordMatch = password === confirmPassword;

  const resetPassword = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "비밀번호 변경 실패");
      }
      return response.json();
    },
    onSuccess: () => {
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
      setTimeout(() => router.push("/sign-in"), 2000);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-xl font-semibold">비밀번호 변경</h1>

      <div className="relative mb-4">
        <label htmlFor="password" className="mb-1 block">
          새로운 비밀 번호를 입력해 주세요.
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="새로운 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full border p-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={clsx("absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800", { hidden: !password })}>
          {showPassword ? <GoEyeClosed size={20} /> : <GoEye size={20} />}
        </button>
      </div>

      <label htmlFor="confirmPassword" className="mb-1 block">
        새로운 비밀번호를 확인해 주세요.
      </label>
      <div className="relative mb-3">
        <input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="block w-full border p-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className={clsx("absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800", { hidden: !confirmPassword })}>
          {showConfirmPassword ? <GoEyeClosed size={20} /> : <GoEye size={20} />}
        </button>
      </div>

      <button
        onClick={() => resetPassword.mutate()}
        disabled={!isPasswordValid || !isPasswordMatch}
        className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-400 disabled:bg-gray-400">
        비밀번호 변경하기
      </button>

      {message && <p className="mt-2 text-green-500">{message}</p>}
    </div>
  );
}
