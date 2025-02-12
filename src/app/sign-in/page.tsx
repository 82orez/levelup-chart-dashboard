"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  // * 클라이언트 컴포넌트에서 로그인 session 정보 가져오기 : useSession()
  const { status, data } = useSession();
  console.log("status: ", status);
  console.log("data: ", data);

  // 로그인이 되어 있을 때 이 페이지로 접근하면 루트 페이지 '/dashboard' 로 되돌림.
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // 페이지 이동 없이 상태만 반환받음
    });

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard"); // 로그인 성공 시 대시보드로 이동
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-xl font-semibold">Sign In</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Sign In
        </button>
      </form>

      <div className={"mt-10 flex justify-center hover:underline"}>
        <Link href={"/"}>To the Home</Link>
      </div>
    </div>
  );
}
