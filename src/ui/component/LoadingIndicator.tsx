"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const [searchParamsString, setSearchParamsString] = useState("");

  useEffect(() => {
    // 클라이언트에서만 실행되도록 설정
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search).toString();
      setSearchParamsString(params);
    }
  }, [pathname]); // pathname 이 변경될 때만 실행

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname, searchParamsString]); // searchParams 변경 감지 가능

  return isLoading ? (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white bg-opacity-50">
      <p className="text-lg font-semibold">로딩 중...</p>
    </div>
  ) : null;
}
