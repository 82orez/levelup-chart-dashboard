"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiSolidMessageRounded } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SignInPage() {
  // * 클라이언트 컴포넌트에서 로그인 session 정보 가져오기 : useSession()
  const { status, data } = useSession();
  console.log("status: ", status);
  console.log("data: ", data);
  const router = useRouter();

  // 로그인이 되어 있을 때 이 페이지로 접근하면 루트 페이지 '/dashboard' 로 되돌림.
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  // * 중복된 email 로 다른 소셜 로그인 인증을 시도했을 때 signIn 콜백 함수에서 반환한 에러 관련 메서지를 받아서 UI 기반 오류 메세지 출력.
  // 콜백 함수에서 반환한 에러 관련 메서지를 처리하기 위한 상태 설정.
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    // ? 오류 방지를 위해 아래 코드를 클라이언트 환경에서만 실행할 수 있도록 설정.
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setError(params.get("error"));
    }
  }, []);

  const [isKakaoLoading, setIsKakaoLoading] = useState(false);

  const handleClickKakao = async () => {
    setIsKakaoLoading(true);
    await signIn("kakao", { callbackUrl: "/dashboard" });
  };

  return (
    <div>
      {/*UI 기반 오류 메세지 부분*/}
      {error === "EmailExists" && (
        <div className="animate-pulse rounded-md bg-cyan-200 p-4 text-center text-red-800">Email 로그인으로 다시 시도해주세요.</div>
      )}

      {status === "loading" ? (
        <div className={"flex h-screen items-center justify-center"}>
          <div className={"animate-pulse text-4xl font-bold"}>Loading...</div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            <h1 className="text-center text-lg font-semibold">로그인 또는 회원가입</h1>
          </div>

          <div className="mx-auto mt-16 flex max-w-[320px] flex-col gap-5">
            {isKakaoLoading ? (
              <div className={"flex items-center justify-center"}>
                <AiOutlineLoading3Quarters className={"animate-spin"} />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleClickKakao}
                className="flex items-center rounded-md border border-gray-700 px-5 py-3 text-center text-sm font-semibold"
                style={{ backgroundColor: "#FEE500" }}>
                <BiSolidMessageRounded className={"text-xl"} />
                <div className={"grow"} style={{ color: "rgba(0, 0, 0, 0.85)" }}>
                  카카오 로그인
                </div>
              </button>
            )}
          </div>

          <div className={"mx-auto mt-20 w-fit hover:underline"}>
            <Link href={"/"} className={""}>
              Move to Home
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
