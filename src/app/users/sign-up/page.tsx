"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();

  const [step, setStep] = useState<"verify" | "register">("verify");
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
    onSuccess: (data) => setMessage(data.message || "Verification code sent to email."),
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
        throw new Error(errorData.message || "Invalid verification code.");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setIsVerified(true);
      setStep("register");
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
      router.push("/login");
    },
    onError: (error: Error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-xl font-semibold">Sign Up</h1>

      {step === "verify" ? (
        <>
          <label htmlFor="email" className="mb-1 block">
            Email:
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 block w-full border p-2"
          />
          <button
            onClick={() => sendVerification.mutate()}
            disabled={!isValidEmail(email) || sendVerification.isPending}
            className="w-full rounded-md bg-blue-600 p-2 text-white disabled:bg-gray-400">
            {sendVerification.isPending ? "Sending..." : "Send Verification Code"}
          </button>

          <div className={clsx("bg-red-100", { hidden: !message || message === "Error: 이미 가입된 이메일입니다." })}>
            <label htmlFor="token" className="mb-1 mt-2 block">
              Verification Code:
            </label>

            <input
              id="token"
              type="text"
              placeholder="Enter code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="block w-full border p-2"
            />
            <button
              onClick={() => validateCode.mutate()}
              disabled={!token || validateCode.isPending}
              className="mt-2 w-full rounded-md bg-green-600 p-2 text-white disabled:bg-gray-400">
              {validateCode.isPending ? "Verifying..." : "Verify Email"}
            </button>
          </div>
        </>
      ) : (
        <>
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
            className="w-full rounded-md bg-blue-600 p-2 text-white disabled:bg-gray-400">
            {registerUser.isPending ? "Registering..." : "Register"}
          </button>
        </>
      )}

      {message && <p className={`mt-2 ${message.startsWith("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

      <div className={"mt-10 flex justify-center text-xl font-bold"}>
        <Link href={"/"}>Home</Link>
      </div>
    </div>
  );
}
