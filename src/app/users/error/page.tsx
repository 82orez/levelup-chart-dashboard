"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";

const errors: Record<string, string> = {
  EmailExists: "이미 가입된 이메일입니다. 비밀번호로 로그인하세요.",
  // 다른 오류 메시지들...
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    console.log(error);
    if (error) {
      setErrorMessage(errors[error] || "알 수 없는 오류가 발생했습니다.");
    }
  }, [searchParams]);

  return (
    <>
      <h1>로그인 오류</h1>
      <p>{errorMessage}</p>
    </>
  );
}

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div>
      <Suspense fallback={<div>로딩 중...</div>}>
        <ErrorContent />
      </Suspense>
      <button onClick={() => router.push("/sign-in")}>로그인 페이지로 돌아가기</button>
    </div>
  );
}
