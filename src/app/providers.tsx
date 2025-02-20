"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

interface Props {
  children?: React.ReactNode;
}

export const queryClient = new QueryClient();

export const NextLayout = ({ children }: Props) => {
  // * 클라이언트 컴포넌트에서 로그인 session 정보 가져오기 : useSession()
  const { status, data } = useSession();
  console.log("status: ", status);
  console.log("data: ", data);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 로그인이 되어 있을 때 이 페이지로 접근하면 루트 페이지 '/dashboard' 로 되돌림.
  useEffect(() => {
    setIsLoading(true);
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
    setIsLoading(false);
  }, [status, router]);

  return (
    <div>
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-6 shadow-lg">
            {/* React Icons 로딩 아이콘 + Tailwind 애니메이션 적용 */}
            <FiLoader className="h-12 w-12 animate-spin text-blue-500" />
            <p className="mt-4 animate-pulse text-lg font-semibold text-gray-700">Loading...</p>
          </div>
        </div>
      ) : (
        <div>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </div>
      )}
    </div>
  );
};
