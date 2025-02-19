"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);

    // 짧은 딜레이를 주어 로딩 상태를 확인 가능하게 함
    const timer = setTimeout(() => setIsLoading(false), 300);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return isLoading ? (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white bg-opacity-50">
      <p className="text-lg font-semibold">로딩 중...</p>
    </div>
  ) : null;
}
