"use client";

import { signOut } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      className={"flex h-10 min-w-28 items-center justify-center rounded-xl border-2 bg-red-300 p-2"}
      onClick={() => {
        setIsLoading(true);
        // * 로그아웃 이후 redirect 할 경로설정.
        signOut({ callbackUrl: "/" });
      }}>
      {isLoading ? <AiOutlineLoading3Quarters className={"animate-spin"} /> : <div>SignOut</div>}
    </button>
  );
}
